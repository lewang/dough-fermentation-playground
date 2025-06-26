import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from scipy.optimize import curve_fit
import joblib
from pathlib import Path
import logging
from typing import Tuple, Dict, Any, Optional
import warnings

logger = logging.getLogger(__name__)

class FermentationModel:
    """Base class for fermentation models."""
    
    def __init__(self, name: str):
        self.name = name
        self.model = None
        self.is_fitted = False
        
    def fit(self, X: np.ndarray, y: np.ndarray):
        """Fit the model to training data."""
        raise NotImplementedError
        
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions."""
        if not self.is_fitted:
            raise ValueError("Model must be fitted before making predictions")
        return self.model.predict(X)
    
    def save(self, filepath: str):
        """Save the fitted model."""
        joblib.dump(self.model, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load(self, filepath: str):
        """Load a fitted model."""
        self.model = joblib.load(filepath)
        self.is_fitted = True
        logger.info(f"Model loaded from {filepath}")

class LinearModel(FermentationModel):
    """Linear regression model."""
    
    def __init__(self):
        super().__init__("Linear")
        self.model = LinearRegression()
    
    def fit(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)
        self.is_fitted = True
        logger.info("Linear model fitted")

class PolynomialModel(FermentationModel):
    """Polynomial regression model."""
    
    def __init__(self, degree: int = 2):
        super().__init__(f"Polynomial_degree_{degree}")
        self.degree = degree
        self.model = Pipeline([
            ('poly', PolynomialFeatures(degree=degree, include_bias=False)),
            ('linear', LinearRegression())
        ])
    
    def fit(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)
        self.is_fitted = True
        logger.info(f"Polynomial model (degree {self.degree}) fitted")

class RandomForestModel(FermentationModel):
    """Random Forest regression model."""
    
    def __init__(self, n_estimators: int = 100, random_state: int = 42):
        super().__init__("RandomForest")
        self.model = RandomForestRegressor(
            n_estimators=n_estimators, 
            random_state=random_state,
            n_jobs=-1
        )
    
    def fit(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)
        self.is_fitted = True
        logger.info("Random Forest model fitted")

class ArrheniusModel(FermentationModel):
    """Arrhenius kinetics model: Time = A * exp(Ea/(R*T)) * (Yeast%)^(-n)"""
    
    def __init__(self):
        super().__init__("Arrhenius")
        self.params = None
        self.R = 8.314  # Gas constant J/(mol*K)
    
    def _arrhenius_func(self, X: np.ndarray, A: float, Ea: float, n: float) -> np.ndarray:
        """Arrhenius function: Time = A * exp(Ea/(R*T)) * (Yeast%)^(-n)"""
        temp_kelvin = X[:, 0] + 273.15  # Convert Celsius to Kelvin
        yeast_pct = X[:, 1]
        
        # Avoid division by zero and negative values
        temp_kelvin = np.maximum(temp_kelvin, 273.15)
        yeast_pct = np.maximum(yeast_pct, 0.001)
        
        return A * np.exp(Ea / (self.R * temp_kelvin)) * (yeast_pct ** (-n))
    
    def fit(self, X: np.ndarray, y: np.ndarray):
        """Fit Arrhenius model using curve fitting."""
        try:
            # Initial parameter guesses
            p0 = [1e-6, 50000, 0.5]  # A, Ea (J/mol), n
            
            # Bounds for parameters
            bounds = ([1e-10, 1000, 0.1], [1e-2, 200000, 2.0])
            
            # Fit the model
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                popt, _ = curve_fit(
                    self._arrhenius_func, X, y, 
                    p0=p0, bounds=bounds, 
                    maxfev=10000
                )
            
            self.params = popt
            self.is_fitted = True
            logger.info(f"Arrhenius model fitted with parameters: A={popt[0]:.2e}, Ea={popt[1]:.0f}, n={popt[2]:.3f}")
            
        except Exception as e:
            logger.error(f"Failed to fit Arrhenius model: {e}")
            # Fallback to simple exponential model
            self._fit_simple_exponential(X, y)
    
    def _fit_simple_exponential(self, X: np.ndarray, y: np.ndarray):
        """Fallback to simple exponential model."""
        def simple_func(X, a, b, c):
            return a * np.exp(b / (X[:, 0] + 273.15)) * (X[:, 1] ** c)
        
        try:
            popt, _ = curve_fit(simple_func, X, y, p0=[1e-3, 1000, -0.5])
            self.params = [popt[0], popt[1], -popt[2]]
            self.is_fitted = True
            logger.info("Fitted simplified exponential model")
        except Exception as e:
            logger.error(f"Failed to fit even simple model: {e}")
            # Use default parameters
            self.params = [1e-6, 50000, 0.5]
            self.is_fitted = True
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions using Arrhenius model."""
        if not self.is_fitted:
            raise ValueError("Model must be fitted before making predictions")
        
        return self._arrhenius_func(X, *self.params)

class ModelManager:
    """Manage multiple fermentation models."""
    
    def __init__(self):
        self.models = {
            'time': {},
            'temperature': {},
            'yeast': {}
        }
        self.best_models = {}
    
    def train_all_models(self, temp: np.ndarray, yeast: np.ndarray, time: np.ndarray):
        """Train all models for all prediction types."""
        
        # Prepare data for different prediction tasks
        X_time = np.column_stack([temp, yeast])  # Predict time from temp, yeast
        X_temp = np.column_stack([time, yeast])  # Predict temp from time, yeast
        X_yeast = np.column_stack([time, temp])  # Predict yeast from time, temp
        
        # Train models for time prediction
        self._train_model_set('time', X_time, time)
        
        # Train models for temperature prediction
        self._train_model_set('temperature', X_temp, temp)
        
        # Train models for yeast prediction
        self._train_model_set('yeast', X_yeast, yeast)
    
    def _train_model_set(self, target: str, X: np.ndarray, y: np.ndarray):
        """Train a set of models for a specific target."""
        logger.info(f"Training models for {target} prediction")
        
        models_to_train = [
            LinearModel(),
            PolynomialModel(degree=2),
            PolynomialModel(degree=3),
            RandomForestModel()
        ]
        
        # Add Arrhenius model only for time prediction
        if target == 'time':
            models_to_train.append(ArrheniusModel())
        
        for model in models_to_train:
            try:
                model.fit(X, y)
                self.models[target][model.name] = model
                logger.info(f"Successfully trained {model.name} for {target}")
            except Exception as e:
                logger.error(f"Failed to train {model.name} for {target}: {e}")
    
    def get_best_model(self, target: str) -> FermentationModel:
        """Get the best model for a specific target."""
        if target not in self.best_models:
            # Default to Random Forest if available, otherwise first available model
            if 'RandomForest' in self.models[target]:
                self.best_models[target] = self.models[target]['RandomForest']
            elif self.models[target]:
                self.best_models[target] = next(iter(self.models[target].values()))
            else:
                raise ValueError(f"No models trained for {target}")
        
        return self.best_models[target]
    
    def save_models(self, directory: str):
        """Save all trained models."""
        save_dir = Path(directory)
        save_dir.mkdir(exist_ok=True)
        
        for target, model_dict in self.models.items():
            for model_name, model in model_dict.items():
                filepath = save_dir / f"{target}_{model_name}.joblib"
                model.save(str(filepath))
    
    def load_models(self, directory: str):
        """Load saved models."""
        load_dir = Path(directory)
        if not load_dir.exists():
            raise FileNotFoundError(f"Model directory not found: {directory}")
        
        for model_file in load_dir.glob("*.joblib"):
            parts = model_file.stem.split('_', 1)
            if len(parts) == 2:
                target, model_name = parts
                if target in self.models:
                    # Create appropriate model instance
                    if model_name == 'Linear':
                        model = LinearModel()
                    elif model_name.startswith('Polynomial'):
                        degree = int(model_name.split('_')[-1])
                        model = PolynomialModel(degree=degree)
                    elif model_name == 'RandomForest':
                        model = RandomForestModel()
                    elif model_name == 'Arrhenius':
                        model = ArrheniusModel()
                    else:
                        continue
                    
                    model.load(str(model_file))
                    self.models[target][model_name] = model