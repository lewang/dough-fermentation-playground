import pytest
import pandas as pd
import numpy as np
import tempfile
import os
from pathlib import Path

from src.predictor import FermentationPredictor

class TestFermentationPredictor:
    
    @pytest.fixture
    def sample_csv_data(self):
        """Create comprehensive sample CSV data."""
        return """°C,0.004%,0.008%,0.013%,0.021%,0.032%
1.7,,,167,136,115
2.2,,,149,121,103
2.8,,,133,108,92
3.3,,161,120,97,82
3.9,,159,108,87,74
4.4,,144,97,79,67
5.0,,130,88,71,61
6.1,,107,72,59,50
7.2,,100,60,49,41
8.3,,83,50,41,35
9.4,,70,42,34,29
10.0,,64,39,32,27
15.0,,32,19,16,13
20.0,,17,10,8,7
25.0,,9,5,4,3
30.0,,5,3,2,2"""
    
    @pytest.fixture
    def temp_csv_file(self, sample_csv_data):
        """Create temporary CSV file."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            f.write(sample_csv_data)
            temp_path = f.name
        
        yield temp_path
        os.unlink(temp_path)
    
    @pytest.fixture
    def temp_model_dir(self):
        """Create temporary model directory."""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield temp_dir
    
    def test_init(self, temp_csv_file, temp_model_dir):
        """Test FermentationPredictor initialization."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        assert predictor.data_path == temp_csv_file
        assert predictor.model_dir == temp_model_dir
        assert not predictor.is_trained
    
    def test_train_models(self, temp_csv_file, temp_model_dir):
        """Test model training."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        predictor.train_models()
        
        assert predictor.is_trained
        
        # Check that model files were created
        model_files = list(Path(temp_model_dir).glob("*.joblib"))
        assert len(model_files) > 0
    
    def test_predict_time(self, temp_csv_file, temp_model_dir):
        """Test time prediction."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        result = predictor.predict(temperature=15.0, yeast_concentration=0.02)
        
        assert result['predicted_parameter'] == 'fermentation_time'
        assert 'predicted_value' in result
        assert result['predicted_value'] > 0
        assert result['unit'] == 'hours'
        assert 'confidence_interval' in result
        assert result['input_temperature'] == 15.0
        assert result['input_yeast_concentration'] == 0.02
    
    def test_predict_temperature(self, temp_csv_file, temp_model_dir):
        """Test temperature prediction."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        result = predictor.predict(fermentation_time=50, yeast_concentration=0.02)
        
        assert result['predicted_parameter'] == 'temperature'
        assert 'predicted_value' in result
        assert result['unit'] == 'Celsius'
        assert result['input_fermentation_time'] == 50
        assert result['input_yeast_concentration'] == 0.02
    
    def test_predict_yeast(self, temp_csv_file, temp_model_dir):
        """Test yeast concentration prediction."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        result = predictor.predict(fermentation_time=50, temperature=15.0)
        
        assert result['predicted_parameter'] == 'yeast_concentration'
        assert 'predicted_value' in result
        assert result['predicted_value'] > 0
        assert result['unit'] == 'percentage'
        assert result['input_fermentation_time'] == 50
        assert result['input_temperature'] == 15.0
    
    def test_predict_invalid_inputs(self, temp_csv_file, temp_model_dir):
        """Test prediction with invalid inputs."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        # No parameters provided
        with pytest.raises(ValueError, match="Exactly 2 of 3 parameters"):
            predictor.predict()
        
        # Only one parameter provided
        with pytest.raises(ValueError, match="Exactly 2 of 3 parameters"):
            predictor.predict(temperature=15.0)
        
        # All three parameters provided
        with pytest.raises(ValueError, match="Exactly 2 of 3 parameters"):
            predictor.predict(temperature=15.0, yeast_concentration=0.02, fermentation_time=50)
    
    def test_validate_inputs(self, temp_csv_file, temp_model_dir):
        """Test input validation."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        # Should not raise exceptions for valid inputs
        predictor._validate_inputs(temperature=15.0)
        predictor._validate_inputs(yeast_concentration=0.1)
        predictor._validate_inputs(fermentation_time=50)
        
        # Test extreme values (should log warnings but not raise exceptions)
        predictor._validate_inputs(temperature=100)  # High temperature
        predictor._validate_inputs(yeast_concentration=2.0)  # High yeast
        predictor._validate_inputs(fermentation_time=2000)  # Long time
    
    def test_get_data_summary(self, temp_csv_file, temp_model_dir):
        """Test data summary retrieval."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        summary = predictor.get_data_summary()
        
        assert isinstance(summary, dict)
        assert 'total_samples' in summary
        assert 'temperature_range' in summary
        assert 'yeast_range' in summary
        assert 'time_range' in summary
    
    def test_get_model_performance(self, temp_csv_file, temp_model_dir):
        """Test model performance retrieval."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        performance = predictor.get_model_performance()
        
        assert isinstance(performance, dict)
        
        # Should have performance metrics for each target
        for target in ['time', 'temperature', 'yeast']:
            if target in performance:
                assert isinstance(performance[target], dict)
                # Each model should have metrics
                for model_name, metrics in performance[target].items():
                    assert 'rmse' in metrics
                    assert 'r2' in metrics
                    assert 'mae' in metrics
    
    def test_predict_batch(self, temp_csv_file, temp_model_dir):
        """Test batch predictions."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        # Create test DataFrame
        test_data = pd.DataFrame({
            'temperature': [15.0, None, 20.0],
            'yeast_concentration': [0.02, 0.03, None],
            'fermentation_time': [None, 60, 40]
        })
        
        results = predictor.predict_batch(test_data)
        
        assert isinstance(results, pd.DataFrame)
        assert len(results) == len(test_data)
        
        # Check that predictions were made
        for idx, row in results.iterrows():
            if 'error' not in row:
                assert 'predicted_parameter' in row
                assert 'predicted_value' in row
    
    def test_confidence_interval_estimation(self, temp_csv_file, temp_model_dir):
        """Test confidence interval estimation."""
        predictor = FermentationPredictor(temp_csv_file, temp_model_dir)
        
        # Test confidence interval calculation
        X = np.array([[15.0, 0.02]])
        prediction = 50.0
        
        ci = predictor._estimate_confidence_interval('time', X, prediction)
        
        assert isinstance(ci, tuple)
        assert len(ci) == 2
        assert ci[0] < ci[1]  # Lower bound < upper bound
        assert ci[0] < prediction < ci[1]  # Prediction within interval