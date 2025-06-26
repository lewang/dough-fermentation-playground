# Fermentation Parameter Prediction Tool

A Python program that predicts fermentation parameters using machine learning models trained on fermentation data. The tool accepts any 2 of 3 parameters (temperature, yeast concentration, fermentation time) and automatically predicts the third parameter.

## Features

- **Auto-inference**: Automatically determines which parameter to predict based on inputs
- **Multiple Models**: Uses Linear Regression, Polynomial Regression, Random Forest, and Arrhenius kinetics models
- **Model Validation**: Cross-validation and performance metrics for model selection
- **CLI Interface**: Easy-to-use command-line interface
- **Batch Predictions**: Support for processing multiple predictions at once
- **Confidence Intervals**: Provides uncertainty estimates for predictions

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Command Line Interface

The CLI automatically infers which parameter to predict based on the 2 parameters you provide:

#### Predict Fermentation Time
```bash
python main.py --temp 15.0 --yeast 0.1
```

#### Predict Temperature  
```bash
python main.py --time 50 --yeast 0.1
```

#### Predict Yeast Concentration
```bash
python main.py --temp 15.0 --time 50
```

### Additional Options

#### Training Models
```bash
python main.py --train
```

#### View Model Performance
```bash
python main.py --performance
```

#### View Data Summary
```bash
python main.py --data-summary
```

#### JSON Output Format
```bash
python main.py --temp 15.0 --yeast 0.1 --output-format json
```

#### Custom Data and Model Paths
```bash
python main.py --temp 15.0 --yeast 0.1 --data-path custom_data.csv --model-dir custom_models/
```

### Python API

```python
from src.predictor import FermentationPredictor

# Initialize predictor
predictor = FermentationPredictor('data/fermentation_analysis.csv')

# Make predictions
result = predictor.predict(temperature=15.0, yeast_concentration=0.1)
print(f"Predicted fermentation time: {result['predicted_value']:.1f} hours")

# Batch predictions
import pandas as pd
test_data = pd.DataFrame({
    'temperature': [15.0, None, 20.0],
    'yeast_concentration': [0.1, 0.2, None], 
    'fermentation_time': [None, 60, 40]
})
results = predictor.predict_batch(test_data)
```

## Data Format

The input CSV should have the following structure:
- First column: Temperature values (°C)
- Header row: Yeast concentration percentages  
- Data cells: Fermentation times (hours)

Example:
```csv
°C,0.004%,0.008%,0.013%,0.021%
1.7,,,167,136
2.2,,,149,121
2.8,,,133,108
```

## Models

The tool uses several machine learning models:

1. **Linear Regression**: Simple linear relationship
2. **Polynomial Regression**: Non-linear relationships (degree 2 and 3)
3. **Random Forest**: Ensemble method for complex patterns
4. **Arrhenius Model**: Biologically-motivated exponential model

The best-performing model is automatically selected for each prediction type based on cross-validation.

## Model Performance

Typical performance metrics:
- **Time Prediction**: R² > 0.9, RMSE < 5 hours
- **Temperature Prediction**: R² > 0.85, RMSE < 2°C  
- **Yeast Prediction**: R² > 0.8, RMSE < 0.05%

## Project Structure

```
fermentation_py/
├── src/
│   ├── data_loader.py      # Data loading and preprocessing
│   ├── models.py           # ML model implementations
│   ├── predictor.py        # Main prediction logic
│   └── validator.py        # Model validation
├── tests/                  # Test suite
├── data/                   # Training data
├── models/                 # Saved trained models
├── main.py                 # CLI interface
├── requirements.txt        # Dependencies
└── README.md              # This file
```

## Testing

Run the test suite:

```bash
pytest tests/
```

Run specific test files:
```bash
pytest tests/test_predictor.py -v
```

## Development

### Adding New Models

1. Create a new model class in `src/models.py` inheriting from `FermentationModel`
2. Implement `fit()` and `predict()` methods
3. Add the model to `ModelManager._train_model_set()`

### Extending Functionality

- Add new prediction methods in `FermentationPredictor`
- Extend CLI options in `main.py`
- Add validation metrics in `ModelValidator`

## Troubleshooting

### Common Issues

**ModuleNotFoundError**: Install dependencies with `pip install -r requirements.txt`

**Data file not found**: Ensure the CSV file path is correct and the file exists

**Poor predictions**: Check that input values are within the training data range

**Training fails**: Verify CSV format matches expected structure

### Logging

Enable verbose logging:
```bash
python main.py --temp 15.0 --yeast 0.1 --verbose
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality  
4. Ensure all tests pass
5. Submit a pull request

## License

This project is open source. See LICENSE file for details.

## Scientific Background

This tool is based on fermentation kinetics principles:

- **Arrhenius Equation**: Temperature dependence follows exponential relationship
- **Michaelis-Menten Kinetics**: Yeast concentration affects reaction rate
- **Combined Model**: Time = A × exp(Ea/(R×T)) × (Yeast%)^(-n)

Where:
- A: Pre-exponential factor
- Ea: Activation energy (J/mol)
- R: Gas constant (8.314 J/mol·K)
- T: Temperature (Kelvin)
- n: Yeast concentration exponent