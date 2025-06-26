import pytest
import numpy as np
from sklearn.datasets import make_regression
import tempfile
import os

from src.models import (
    LinearModel, PolynomialModel, RandomForestModel, 
    ArrheniusModel, ModelManager
)

class TestFermentationModels:
    
    @pytest.fixture
    def sample_data(self):
        """Create sample regression data."""
        X, y = make_regression(n_samples=100, n_features=2, noise=0.1, random_state=42)
        # Ensure positive values for fermentation data
        X = np.abs(X) + 1
        y = np.abs(y) + 1
        return X, y
    
    @pytest.fixture
    def fermentation_data(self):
        """Create realistic fermentation data."""
        np.random.seed(42)
        n_samples = 50
        
        # Temperature: 5-35°C
        temp = np.random.uniform(5, 35, n_samples)
        # Yeast: 0.01-0.5%
        yeast = np.random.uniform(0.01, 0.5, n_samples)
        # Time: approximate inverse relationship
        time = 100 / (temp * yeast) + np.random.normal(0, 5, n_samples)
        time = np.maximum(time, 1)  # Ensure positive
        
        X = np.column_stack([temp, yeast])
        return X, time

class TestLinearModel(TestFermentationModels):
    
    def test_init(self):
        """Test LinearModel initialization."""
        model = LinearModel()
        assert model.name == "Linear"
        assert not model.is_fitted
    
    def test_fit_predict(self, sample_data):
        """Test fitting and prediction."""
        X, y = sample_data
        model = LinearModel()
        
        # Fit the model
        model.fit(X, y)
        assert model.is_fitted
        
        # Make predictions
        predictions = model.predict(X)
        assert len(predictions) == len(y)
        assert isinstance(predictions, np.ndarray)
    
    def test_predict_before_fit(self, sample_data):
        """Test prediction before fitting raises error."""
        X, y = sample_data
        model = LinearModel()
        
        with pytest.raises(ValueError, match="Model must be fitted"):
            model.predict(X)

class TestPolynomialModel(TestFermentationModels):
    
    def test_init(self):
        """Test PolynomialModel initialization."""
        model = PolynomialModel(degree=2)
        assert model.name == "Polynomial_degree_2"
        assert model.degree == 2
        assert not model.is_fitted
    
    def test_fit_predict(self, sample_data):
        """Test fitting and prediction."""
        X, y = sample_data
        model = PolynomialModel(degree=2)
        
        model.fit(X, y)
        assert model.is_fitted
        
        predictions = model.predict(X)
        assert len(predictions) == len(y)

class TestRandomForestModel(TestFermentationModels):
    
    def test_init(self):
        """Test RandomForestModel initialization."""
        model = RandomForestModel(n_estimators=10)
        assert model.name == "RandomForest"
        assert not model.is_fitted
    
    def test_fit_predict(self, sample_data):
        """Test fitting and prediction."""
        X, y = sample_data
        model = RandomForestModel(n_estimators=10)
        
        model.fit(X, y)
        assert model.is_fitted
        
        predictions = model.predict(X)
        assert len(predictions) == len(y)

class TestArrheniusModel(TestFermentationModels):
    
    def test_init(self):
        """Test ArrheniusModel initialization."""
        model = ArrheniusModel()
        assert model.name == "Arrhenius"
        assert model.R == 8.314
        assert not model.is_fitted
    
    def test_fit_predict(self, fermentation_data):
        """Test fitting and prediction with fermentation-like data."""
        X, y = fermentation_data
        model = ArrheniusModel()
        
        model.fit(X, y)
        assert model.is_fitted
        assert model.params is not None
        assert len(model.params) == 3  # A, Ea, n
        
        predictions = model.predict(X)
        assert len(predictions) == len(y)
        assert np.all(predictions > 0)  # Should be positive times
    
    def test_arrhenius_function(self, fermentation_data):
        """Test Arrhenius function directly."""
        X, y = fermentation_data
        model = ArrheniusModel()
        
        # Test with known parameters
        A, Ea, n = 1e-6, 50000, 0.5
        result = model._arrhenius_func(X, A, Ea, n)
        
        assert len(result) == len(X)
        assert np.all(result > 0)
        assert np.all(np.isfinite(result))

class TestModelManager(TestFermentationModels):
    
    def test_init(self):
        """Test ModelManager initialization."""
        manager = ModelManager()
        
        assert 'time' in manager.models
        assert 'temperature' in manager.models  
        assert 'yeast' in manager.models
        assert len(manager.best_models) == 0
    
    def test_train_all_models(self, fermentation_data):
        """Test training all models."""
        X, time = fermentation_data
        temp = X[:, 0]
        yeast = X[:, 1]
        
        manager = ModelManager()
        manager.train_all_models(temp, yeast, time)
        
        # Check that models were trained for each target
        for target in ['time', 'temperature', 'yeast']:
            assert len(manager.models[target]) > 0
    
    def test_get_best_model(self, fermentation_data):
        """Test getting best model."""
        X, time = fermentation_data
        temp = X[:, 0]
        yeast = X[:, 1]
        
        manager = ModelManager()
        manager.train_all_models(temp, yeast, time)
        
        # Should be able to get best model for each target
        for target in ['time', 'temperature', 'yeast']:
            best_model = manager.get_best_model(target)
            assert best_model is not None
            assert best_model.is_fitted
    
    def test_save_load_models(self, fermentation_data):
        """Test saving and loading models."""
        X, time = fermentation_data
        temp = X[:, 0]
        yeast = X[:, 1]
        
        manager = ModelManager()
        manager.train_all_models(temp, yeast, time)
        
        # Save models
        with tempfile.TemporaryDirectory() as temp_dir:
            manager.save_models(temp_dir)
            
            # Check that files were created
            model_files = list(Path(temp_dir).glob("*.joblib"))
            assert len(model_files) > 0
            
            # Load models into new manager
            new_manager = ModelManager()
            new_manager.load_models(temp_dir)
            
            # Check that models were loaded
            for target in ['time', 'temperature', 'yeast']:
                assert len(new_manager.models[target]) > 0
                for model in new_manager.models[target].values():
                    assert model.is_fitted

from pathlib import Path