import pytest
import pandas as pd
import numpy as np
from pathlib import Path
import tempfile
import os

from src.data_loader import FermentationDataLoader

class TestFermentationDataLoader:
    
    @pytest.fixture
    def sample_csv_data(self):
        """Create sample CSV data for testing."""
        return """°C,0.004%,0.008%,0.013%,0.021%
1.7,,,167,136
2.2,,,149,121
2.8,,,133,108
3.3,,161,120,97"""
    
    @pytest.fixture
    def temp_csv_file(self, sample_csv_data):
        """Create temporary CSV file."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            f.write(sample_csv_data)
            temp_path = f.name
        
        yield temp_path
        
        # Cleanup
        os.unlink(temp_path)
    
    def test_init(self, temp_csv_file):
        """Test DataLoader initialization."""
        loader = FermentationDataLoader(temp_csv_file)
        assert loader.data_path == Path(temp_csv_file)
        assert loader.raw_data is None
        assert loader.clean_data is None
    
    def test_load_data(self, temp_csv_file):
        """Test data loading."""
        loader = FermentationDataLoader(temp_csv_file)
        data = loader.load_data()
        
        assert isinstance(data, pd.DataFrame)
        assert loader.raw_data is not None
        assert data.shape[0] > 0  # Has rows
        assert data.shape[1] > 0  # Has columns
    
    def test_load_nonexistent_file(self):
        """Test loading non-existent file raises error."""
        loader = FermentationDataLoader("nonexistent.csv")
        
        with pytest.raises(FileNotFoundError):
            loader.load_data()
    
    def test_preprocess_data(self, temp_csv_file):
        """Test data preprocessing."""
        loader = FermentationDataLoader(temp_csv_file)
        clean_data = loader.preprocess_data()
        
        assert isinstance(clean_data, pd.DataFrame)
        assert 'temperature' in clean_data.columns
        assert 'yeast_concentration' in clean_data.columns
        assert 'fermentation_time' in clean_data.columns
        
        # Check data types
        assert clean_data['temperature'].dtype in [np.float64, np.int64]
        assert clean_data['yeast_concentration'].dtype in [np.float64, np.int64]
        assert clean_data['fermentation_time'].dtype in [np.float64, np.int64]
        
        # Check no missing values in clean data
        assert not clean_data.isnull().any().any()
    
    def test_get_feature_matrices(self, temp_csv_file):
        """Test feature matrix extraction."""
        loader = FermentationDataLoader(temp_csv_file)
        temp, yeast, time = loader.get_feature_matrices()
        
        assert isinstance(temp, np.ndarray)
        assert isinstance(yeast, np.ndarray)
        assert isinstance(time, np.ndarray)
        
        # All arrays should have same length
        assert len(temp) == len(yeast) == len(time)
        
        # All values should be positive
        assert np.all(temp > 0)
        assert np.all(yeast > 0)
        assert np.all(time > 0)
    
    def test_get_data_summary(self, temp_csv_file):
        """Test data summary generation."""
        loader = FermentationDataLoader(temp_csv_file)
        summary = loader.get_data_summary()
        
        assert isinstance(summary, dict)
        assert 'total_samples' in summary
        assert 'temperature_range' in summary
        assert 'yeast_range' in summary
        assert 'time_range' in summary
        assert 'missing_values' in summary
        
        # Check ranges are tuples with min, max
        temp_range = summary['temperature_range']
        assert isinstance(temp_range, tuple)
        assert len(temp_range) == 2
        assert temp_range[0] <= temp_range[1]
    
    def test_remove_outliers(self, temp_csv_file):
        """Test outlier removal."""
        loader = FermentationDataLoader(temp_csv_file)
        
        # Create test data with outliers
        test_data = pd.DataFrame({
            'temperature': [10, 15, 20, 25, 100],  # 100 is outlier
            'yeast_concentration': [0.1, 0.2, 0.3, 0.4, 0.5],
            'fermentation_time': [50, 60, 70, 80, 1000]  # 1000 is outlier
        })
        
        clean_data = loader._remove_outliers(test_data, ['fermentation_time'])
        
        # Should remove the outlier
        assert len(clean_data) < len(test_data)
        assert 1000 not in clean_data['fermentation_time'].values