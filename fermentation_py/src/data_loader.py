import pandas as pd
import numpy as np
from pathlib import Path
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class FermentationDataLoader:
    """Load and preprocess fermentation data from CSV."""
    
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)
        self.raw_data = None
        self.clean_data = None
        
    def load_data(self) -> pd.DataFrame:
        """Load raw CSV data."""
        if not self.data_path.exists():
            raise FileNotFoundError(f"Data file not found: {self.data_path}")
            
        self.raw_data = pd.read_csv(self.data_path)
        logger.info(f"Loaded data with shape: {self.raw_data.shape}")
        return self.raw_data
    
    def preprocess_data(self) -> pd.DataFrame:
        """Clean and preprocess the fermentation data."""
        if self.raw_data is None:
            self.load_data()
            
        # Extract temperature column (first column after row identifier)
        temp_col = self.raw_data.iloc[:, 0].str.replace('°C', '').str.extract(r'(\d+\.?\d*)')[0]
        temperatures = pd.to_numeric(temp_col, errors='coerce')
        
        # Extract yeast concentration columns (header row)
        yeast_concentrations = []
        fermentation_times = []
        temps_expanded = []
        
        # Parse column headers to get yeast concentrations
        headers = self.raw_data.columns[1:]  # Skip first column (temperatures)
        yeast_values = []
        
        for header in headers:
            if '%' in header:
                # Extract percentage value
                yeast_val = float(header.replace('%', ''))
                yeast_values.append(yeast_val)
            else:
                yeast_values.append(np.nan)
        
        # Extract fermentation times for each temperature-yeast combination
        for i, temp in enumerate(temperatures):
            if pd.notna(temp):
                for j, yeast_val in enumerate(yeast_values):
                    if pd.notna(yeast_val):
                        try:
                            time_val = pd.to_numeric(self.raw_data.iloc[i, j+1], errors='coerce')
                            if pd.notna(time_val) and time_val > 0:
                                temps_expanded.append(temp)
                                yeast_concentrations.append(yeast_val)
                                fermentation_times.append(time_val)
                        except (IndexError, ValueError):
                            continue
        
        # Create clean DataFrame
        self.clean_data = pd.DataFrame({
            'temperature': temps_expanded,
            'yeast_concentration': yeast_concentrations,
            'fermentation_time': fermentation_times
        })
        
        # Remove outliers using IQR method
        self.clean_data = self._remove_outliers(self.clean_data)
        
        logger.info(f"Cleaned data shape: {self.clean_data.shape}")
        return self.clean_data
    
    def _remove_outliers(self, df: pd.DataFrame, columns: Optional[list] = None) -> pd.DataFrame:
        """Remove outliers using IQR method."""
        if columns is None:
            columns = ['fermentation_time']
            
        df_clean = df.copy()
        
        for col in columns:
            Q1 = df_clean[col].quantile(0.25)
            Q3 = df_clean[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            initial_count = len(df_clean)
            df_clean = df_clean[(df_clean[col] >= lower_bound) & (df_clean[col] <= upper_bound)]
            removed_count = initial_count - len(df_clean)
            
            if removed_count > 0:
                logger.info(f"Removed {removed_count} outliers from {col}")
        
        return df_clean
    
    def get_feature_matrices(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Get feature matrices for model training."""
        if self.clean_data is None:
            self.preprocess_data()
            
        temp = self.clean_data['temperature'].values
        yeast = self.clean_data['yeast_concentration'].values
        time = self.clean_data['fermentation_time'].values
        
        return temp, yeast, time
    
    def get_data_summary(self) -> dict:
        """Get summary statistics of the cleaned data."""
        if self.clean_data is None:
            self.preprocess_data()
            
        return {
            'total_samples': len(self.clean_data),
            'temperature_range': (self.clean_data['temperature'].min(), 
                                self.clean_data['temperature'].max()),
            'yeast_range': (self.clean_data['yeast_concentration'].min(),
                          self.clean_data['yeast_concentration'].max()),
            'time_range': (self.clean_data['fermentation_time'].min(),
                         self.clean_data['fermentation_time'].max()),
            'missing_values': self.clean_data.isnull().sum().to_dict()
        }