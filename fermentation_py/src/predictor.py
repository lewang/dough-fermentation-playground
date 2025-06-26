import numpy as np
import pandas as pd
from pathlib import Path
from typing import Optional, Tuple, Dict, Any
import logging

from .data_loader import FermentationDataLoader
from .models import ModelManager
from .validator import ModelValidator

logger = logging.getLogger(__name__)

class FermentationPredictor:
    """Main class for fermentation parameter prediction with auto-inference."""
    
    def __init__(self, data_path: str, model_dir: Optional[str] = None):
        self.data_path = data_path
        self.model_dir = model_dir
        self.data_loader = FermentationDataLoader(data_path)
        self.model_manager = ModelManager()
        self.validator = ModelValidator()
        self.is_trained = False
        
        # Load existing models if available
        if model_dir and Path(model_dir).exists():
            try:
                self.model_manager.load_models(model_dir)
                self.is_trained = True
                logger.info("Loaded existing models")
            except Exception as e:
                logger.warning(f"Failed to load existing models: {e}")
    
    def train_models(self, retrain: bool = False):
        """Train all prediction models."""
        if self.is_trained and not retrain:
            logger.info("Models already trained. Use retrain=True to force retraining.")
            return
        
        logger.info("Loading and preprocessing data...")
        temp, yeast, time = self.data_loader.get_feature_matrices()
        
        logger.info("Training models...")
        self.model_manager.train_all_models(temp, yeast, time)
        
        # Validate models
        logger.info("Validating models...")
        validation_results = self.validator.validate_all_models(
            self.model_manager, temp, yeast, time
        )
        
        # Select best models based on validation
        self._select_best_models(validation_results)
        
        self.is_trained = True
        
        # Save models if directory specified
        if self.model_dir:
            Path(self.model_dir).mkdir(exist_ok=True)
            self.model_manager.save_models(self.model_dir)
            logger.info(f"Models saved to {self.model_dir}")
    
    def _select_best_models(self, validation_results: Dict[str, Dict[str, float]]):
        """Select best models based on validation results."""
        for target in ['time', 'temperature', 'yeast']:
            if target in validation_results:
                # Select model with lowest RMSE
                best_model_name = min(
                    validation_results[target].items(),
                    key=lambda x: x[1]['rmse']
                )[0]
                
                if best_model_name in self.model_manager.models[target]:
                    self.model_manager.best_models[target] = \
                        self.model_manager.models[target][best_model_name]
                    logger.info(f"Selected {best_model_name} as best model for {target}")
    
    def predict(self, temperature: Optional[float] = None, 
                yeast_concentration: Optional[float] = None,
                fermentation_time: Optional[float] = None) -> Dict[str, Any]:
        """
        Predict missing parameter based on the two provided parameters.
        
        Args:
            temperature: Temperature in Celsius
            yeast_concentration: Yeast concentration as percentage
            fermentation_time: Fermentation time in hours
            
        Returns:
            Dictionary containing prediction results
        """
        if not self.is_trained:
            self.train_models()
        
        # Validate inputs
        provided_params = sum([
            temperature is not None,
            yeast_concentration is not None, 
            fermentation_time is not None
        ])
        
        if provided_params != 2:
            raise ValueError("Exactly 2 of 3 parameters must be provided")
        
        # Determine what to predict and make prediction
        if temperature is None:
            return self._predict_temperature(fermentation_time, yeast_concentration)
        elif yeast_concentration is None:
            return self._predict_yeast_concentration(fermentation_time, temperature)
        else:  # fermentation_time is None
            return self._predict_fermentation_time(temperature, yeast_concentration)
    
    def _predict_fermentation_time(self, temperature: float, 
                                  yeast_concentration: float) -> Dict[str, Any]:
        """Predict fermentation time from temperature and yeast concentration."""
        # Validate inputs
        self._validate_inputs(temperature=temperature, yeast_concentration=yeast_concentration)
        
        # Prepare input
        X = np.array([[temperature, yeast_concentration]])
        
        # Get best model and make prediction
        model = self.model_manager.get_best_model('time')
        prediction = model.predict(X)[0]
        
        # Calculate confidence interval (simplified approach)
        confidence_interval = self._estimate_confidence_interval(
            'time', X, prediction
        )
        
        return {
            'predicted_parameter': 'fermentation_time',
            'predicted_value': max(0, prediction),  # Ensure non-negative
            'unit': 'hours',
            'confidence_interval': confidence_interval,
            'input_temperature': temperature,
            'input_yeast_concentration': yeast_concentration,
            'model_used': model.name
        }
    
    def _predict_temperature(self, fermentation_time: float, 
                           yeast_concentration: float) -> Dict[str, Any]:
        """Predict temperature from fermentation time and yeast concentration."""
        # Validate inputs
        self._validate_inputs(fermentation_time=fermentation_time, 
                            yeast_concentration=yeast_concentration)
        
        # Prepare input
        X = np.array([[fermentation_time, yeast_concentration]])
        
        # Get best model and make prediction
        model = self.model_manager.get_best_model('temperature')
        prediction = model.predict(X)[0]
        
        # Calculate confidence interval
        confidence_interval = self._estimate_confidence_interval(
            'temperature', X, prediction
        )
        
        return {
            'predicted_parameter': 'temperature',
            'predicted_value': prediction,
            'unit': 'Celsius',
            'confidence_interval': confidence_interval,
            'input_fermentation_time': fermentation_time,
            'input_yeast_concentration': yeast_concentration,
            'model_used': model.name
        }
    
    def _predict_yeast_concentration(self, fermentation_time: float, 
                                   temperature: float) -> Dict[str, Any]:
        """Predict yeast concentration from fermentation time and temperature."""
        # Validate inputs
        self._validate_inputs(fermentation_time=fermentation_time, temperature=temperature)
        
        # Prepare input
        X = np.array([[fermentation_time, temperature]])
        
        # Get best model and make prediction
        model = self.model_manager.get_best_model('yeast')
        prediction = model.predict(X)[0]
        
        # Calculate confidence interval
        confidence_interval = self._estimate_confidence_interval(
            'yeast', X, prediction
        )
        
        return {
            'predicted_parameter': 'yeast_concentration',
            'predicted_value': max(0, prediction),  # Ensure non-negative
            'unit': 'percentage',
            'confidence_interval': confidence_interval,
            'input_fermentation_time': fermentation_time,
            'input_temperature': temperature,
            'model_used': model.name
        }
    
    def _validate_inputs(self, temperature: Optional[float] = None,
                        yeast_concentration: Optional[float] = None,
                        fermentation_time: Optional[float] = None):
        """Validate input parameters."""
        if temperature is not None:
            if not (0 <= temperature <= 50):
                logger.warning(f"Temperature {temperature}°C is outside typical range (0-50°C)")
        
        if yeast_concentration is not None:
            if not (0 < yeast_concentration <= 1):
                logger.warning(f"Yeast concentration {yeast_concentration}% is outside typical range (0-1%)")
        
        if fermentation_time is not None:
            if not (0 < fermentation_time <= 1000):
                logger.warning(f"Fermentation time {fermentation_time}h is outside typical range (0-1000h)")
    
    def _estimate_confidence_interval(self, target: str, X: np.ndarray, 
                                    prediction: float) -> Tuple[float, float]:
        """Estimate confidence interval for prediction (simplified approach)."""
        # This is a simplified approach - in practice, you'd want to use
        # proper statistical methods or model-specific uncertainty estimates
        
        # Get data ranges for scaling uncertainty
        data_summary = self.data_loader.get_data_summary()
        
        if target == 'time':
            data_range = data_summary['time_range']
            uncertainty_factor = 0.1  # 10% uncertainty
        elif target == 'temperature':
            data_range = data_summary['temperature_range']
            uncertainty_factor = 0.05  # 5% uncertainty
        else:  # yeast
            data_range = data_summary['yeast_range']
            uncertainty_factor = 0.15  # 15% uncertainty
        
        # Calculate uncertainty based on prediction value and data range
        uncertainty = max(
            abs(prediction) * uncertainty_factor,
            (data_range[1] - data_range[0]) * 0.01
        )
        
        lower_bound = prediction - uncertainty
        upper_bound = prediction + uncertainty
        
        return (lower_bound, upper_bound)
    
    def get_model_performance(self) -> Dict[str, Dict[str, float]]:
        """Get performance metrics for all models."""
        if not self.is_trained:
            self.train_models()
        
        temp, yeast, time = self.data_loader.get_feature_matrices()
        return self.validator.validate_all_models(
            self.model_manager, temp, yeast, time
        )
    
    def get_data_summary(self) -> Dict[str, Any]:
        """Get summary of the training data."""
        return self.data_loader.get_data_summary()
    
    def predict_batch(self, df: pd.DataFrame) -> pd.DataFrame:
        """Make batch predictions from a DataFrame."""
        if not self.is_trained:
            self.train_models()
        
        results = []
        
        for idx, row in df.iterrows():
            try:
                temp = row.get('temperature')
                yeast = row.get('yeast_concentration') 
                time = row.get('fermentation_time')
                
                # Convert None values from missing data
                temp = None if pd.isna(temp) else temp
                yeast = None if pd.isna(yeast) else yeast
                time = None if pd.isna(time) else time
                
                result = self.predict(
                    temperature=temp,
                    yeast_concentration=yeast,
                    fermentation_time=time
                )
                
                result['row_index'] = idx
                results.append(result)
                
            except Exception as e:
                logger.error(f"Failed to predict for row {idx}: {e}")
                results.append({
                    'row_index': idx,
                    'error': str(e)
                })
        
        return pd.DataFrame(results)