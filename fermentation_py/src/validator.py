import numpy as np
from sklearn.model_selection import cross_val_score, KFold
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from typing import Dict, Tuple, Any
import logging

from .models import ModelManager

logger = logging.getLogger(__name__)

class ModelValidator:
    """Model validation and performance metrics."""
    
    def __init__(self, cv_folds: int = 5, random_state: int = 42):
        self.cv_folds = cv_folds
        self.random_state = random_state
        self.kfold = KFold(n_splits=cv_folds, shuffle=True, random_state=random_state)
    
    def validate_model(self, model, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """Validate a single model and return performance metrics."""
        try:
            # Make predictions
            y_pred = model.predict(X)
            
            # Calculate metrics
            rmse = np.sqrt(mean_squared_error(y, y_pred))
            mae = mean_absolute_error(y, y_pred)
            r2 = r2_score(y, y_pred)
            
            # Calculate cross-validation scores for sklearn models
            cv_scores = None
            if hasattr(model.model, 'fit') and hasattr(model.model, 'predict'):
                try:
                    cv_scores = cross_val_score(
                        model.model, X, y, 
                        cv=self.kfold, 
                        scoring='neg_mean_squared_error'
                    )
                    cv_rmse = np.sqrt(-cv_scores.mean())
                    cv_std = cv_scores.std()
                except Exception as e:
                    logger.warning(f"Cross-validation failed for {model.name}: {e}")
                    cv_rmse = rmse
                    cv_std = 0.0
            else:
                cv_rmse = rmse
                cv_std = 0.0
            
            return {
                'rmse': rmse,
                'mae': mae,
                'r2': r2,
                'cv_rmse': cv_rmse,
                'cv_std': cv_std
            }
            
        except Exception as e:
            logger.error(f"Validation failed for {model.name}: {e}")
            return {
                'rmse': float('inf'),
                'mae': float('inf'),
                'r2': -float('inf'),
                'cv_rmse': float('inf'),
                'cv_std': float('inf')
            }
    
    def validate_all_models(self, model_manager: ModelManager, 
                          temp: np.ndarray, yeast: np.ndarray, 
                          time: np.ndarray) -> Dict[str, Dict[str, Dict[str, float]]]:
        """Validate all models for all prediction targets."""
        results = {}
        
        # Prepare data for different prediction tasks
        datasets = {
            'time': (np.column_stack([temp, yeast]), time),
            'temperature': (np.column_stack([time, yeast]), temp),
            'yeast': (np.column_stack([time, temp]), yeast)
        }
        
        for target, (X, y) in datasets.items():
            results[target] = {}
            
            if target in model_manager.models:
                for model_name, model in model_manager.models[target].items():
                    logger.info(f"Validating {model_name} for {target} prediction")
                    metrics = self.validate_model(model, X, y)
                    results[target][model_name] = metrics
                    
                    logger.info(f"{model_name} - RMSE: {metrics['rmse']:.3f}, "
                              f"R²: {metrics['r2']:.3f}, MAE: {metrics['mae']:.3f}")
        
        return results
    
    def get_best_model_for_target(self, validation_results: Dict[str, Dict[str, float]], 
                                 target: str) -> Tuple[str, Dict[str, float]]:
        """Get the best model name and metrics for a specific target."""
        if target not in validation_results:
            raise ValueError(f"No validation results for target: {target}")
        
        # Find model with lowest RMSE
        best_model = min(
            validation_results[target].items(),
            key=lambda x: x[1]['rmse']
        )
        
        return best_model
    
    def generate_validation_report(self, validation_results: Dict[str, Dict[str, Dict[str, float]]]) -> str:
        """Generate a formatted validation report."""
        report = []
        report.append("=" * 80)
        report.append("FERMENTATION MODEL VALIDATION REPORT")
        report.append("=" * 80)
        
        for target in ['time', 'temperature', 'yeast']:
            if target not in validation_results:
                continue
                
            report.append(f"\n{target.upper()} PREDICTION MODELS:")
            report.append("-" * 40)
            
            # Sort models by RMSE
            sorted_models = sorted(
                validation_results[target].items(),
                key=lambda x: x[1]['rmse']
            )
            
            for model_name, metrics in sorted_models:
                report.append(f"\n{model_name}:")
                report.append(f"  RMSE: {metrics['rmse']:.4f}")
                report.append(f"  MAE:  {metrics['mae']:.4f}")
                report.append(f"  R²:   {metrics['r2']:.4f}")
                if metrics['cv_rmse'] != metrics['rmse']:
                    report.append(f"  CV-RMSE: {metrics['cv_rmse']:.4f} ± {metrics['cv_std']:.4f}")
            
            # Highlight best model
            if sorted_models:
                best_model, best_metrics = sorted_models[0]
                report.append(f"\n★ BEST MODEL: {best_model} (RMSE: {best_metrics['rmse']:.4f})")
        
        report.append("\n" + "=" * 80)
        return "\n".join(report)
    
    def calculate_prediction_intervals(self, model, X: np.ndarray, 
                                     confidence_level: float = 0.95) -> Tuple[np.ndarray, np.ndarray]:
        """Calculate prediction intervals (simplified approach)."""
        # This is a simplified approach - proper prediction intervals would require
        # model-specific statistical methods
        
        predictions = model.predict(X)
        
        # Estimate prediction variance (simplified)
        # In practice, this would be model-specific
        prediction_std = np.std(predictions) * 0.2  # Rough estimate
        
        # Calculate confidence intervals
        z_score = 1.96 if confidence_level == 0.95 else 2.58  # 95% or 99%
        margin_of_error = z_score * prediction_std
        
        lower_bound = predictions - margin_of_error
        upper_bound = predictions + margin_of_error
        
        return lower_bound, upper_bound
    
    def residual_analysis(self, model, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Perform residual analysis."""
        predictions = model.predict(X)
        residuals = y - predictions
        
        return {
            'residuals': residuals,
            'mean_residual': np.mean(residuals),
            'std_residual': np.std(residuals),
            'residual_range': (np.min(residuals), np.max(residuals)),
            'predictions': predictions,
            'actual_values': y
        }
    
    def compare_models(self, validation_results: Dict[str, Dict[str, Dict[str, float]]], 
                      target: str) -> Dict[str, Any]:
        """Compare models for a specific target."""
        if target not in validation_results:
            return {}
        
        models_data = validation_results[target]
        
        # Find best and worst models
        best_model = min(models_data.items(), key=lambda x: x[1]['rmse'])
        worst_model = max(models_data.items(), key=lambda x: x[1]['rmse'])
        
        # Calculate improvement
        improvement = (worst_model[1]['rmse'] - best_model[1]['rmse']) / worst_model[1]['rmse'] * 100
        
        return {
            'best_model': best_model[0],
            'best_rmse': best_model[1]['rmse'],
            'worst_model': worst_model[0],
            'worst_rmse': worst_model[1]['rmse'],
            'improvement_percent': improvement,
            'model_count': len(models_data)
        }