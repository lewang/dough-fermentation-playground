#!/usr/bin/env python3
"""
Fermentation Parameter Prediction Tool

This tool predicts fermentation parameters using machine learning models.
Provide any 2 of the 3 parameters (temperature, yeast%, time) and get the third.
"""

import argparse
import sys
import logging
from pathlib import Path
import json

from src.predictor import FermentationPredictor

def setup_logging(verbose: bool = False):
    """Setup logging configuration."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

def create_parser():
    """Create command line argument parser."""
    parser = argparse.ArgumentParser(
        description='Fermentation Parameter Prediction Tool',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Predict fermentation time from temperature and yeast concentration
  python main.py --temp 15.0 --yeast 0.1
  
  # Predict temperature from time and yeast concentration  
  python main.py --time 50 --yeast 0.1
  
  # Predict yeast concentration from temperature and time
  python main.py --temp 15.0 --time 50
  
  # Train models (usually done automatically on first run)
  python main.py --train
  
  # Show model performance
  python main.py --performance
        """
    )
    
    # Input parameters
    parser.add_argument('--temp', '--temperature', type=float, dest='temperature',
                       help='Temperature in degrees Celsius')
    parser.add_argument('--yeast', '--yeast-concentration', type=float, dest='yeast_concentration',
                       help='Yeast concentration as percentage (e.g., 0.1 for 0.1%%)')
    parser.add_argument('--time', '--fermentation-time', type=float, dest='fermentation_time',
                       help='Fermentation time in hours')
    
    # Action parameters
    parser.add_argument('--train', action='store_true',
                       help='Train models (force retrain if models exist)')
    parser.add_argument('--performance', action='store_true',
                       help='Show model performance metrics')
    parser.add_argument('--data-summary', action='store_true',
                       help='Show summary of training data')
    
    # Configuration parameters
    parser.add_argument('--data-path', type=str, 
                       default='data/fermentation_analysis.csv',
                       help='Path to fermentation data CSV file')
    parser.add_argument('--model-dir', type=str,
                       default='models',
                       help='Directory to save/load trained models')
    parser.add_argument('--output-format', choices=['text', 'json'], 
                       default='text',
                       help='Output format')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose logging')
    
    return parser

def format_prediction_output(result: dict, output_format: str) -> str:
    """Format prediction output."""
    if output_format == 'json':
        return json.dumps(result, indent=2)
    
    # Text format
    lines = []
    lines.append("🧪 FERMENTATION PREDICTION RESULT")
    lines.append("=" * 50)
    
    # Main result
    param = result['predicted_parameter'].replace('_', ' ').title()
    value = result['predicted_value']
    unit = result['unit']
    
    lines.append(f"Predicted {param}: {value:.2f} {unit}")
    
    # Confidence interval
    if 'confidence_interval' in result:
        ci_low, ci_high = result['confidence_interval']
        lines.append(f"Confidence Interval: [{ci_low:.2f}, {ci_high:.2f}] {unit}")
    
    # Input parameters
    lines.append("\nInput Parameters:")
    for key, value in result.items():
        if key.startswith('input_'):
            param_name = key.replace('input_', '').replace('_', ' ').title()
            lines.append(f"  {param_name}: {value}")
    
    # Model info
    lines.append(f"\nModel Used: {result.get('model_used', 'Unknown')}")
    
    return "\n".join(lines)

def format_performance_output(performance: dict, output_format: str) -> str:
    """Format performance metrics output."""
    if output_format == 'json':
        return json.dumps(performance, indent=2)
    
    # Text format
    lines = []
    lines.append("📊 MODEL PERFORMANCE METRICS")
    lines.append("=" * 60)
    
    for target, models in performance.items():
        lines.append(f"\n{target.upper()} PREDICTION:")
        lines.append("-" * 30)
        
        # Sort models by RMSE
        sorted_models = sorted(models.items(), key=lambda x: x[1]['rmse'])
        
        for model_name, metrics in sorted_models:
            lines.append(f"\n{model_name}:")
            lines.append(f"  RMSE: {metrics['rmse']:.4f}")
            lines.append(f"  R²:   {metrics['r2']:.4f}")
            lines.append(f"  MAE:  {metrics['mae']:.4f}")
        
        # Mark best model
        if sorted_models:
            best_model = sorted_models[0][0]
            lines.append(f"\n★ Best Model: {best_model}")
    
    return "\n".join(lines)

def format_data_summary(summary: dict, output_format: str) -> str:
    """Format data summary output."""
    if output_format == 'json':
        return json.dumps(summary, indent=2)
    
    # Text format
    lines = []
    lines.append("📈 TRAINING DATA SUMMARY")
    lines.append("=" * 40)
    
    lines.append(f"Total Samples: {summary['total_samples']}")
    
    temp_min, temp_max = summary['temperature_range']
    lines.append(f"Temperature Range: {temp_min:.1f}°C - {temp_max:.1f}°C")
    
    yeast_min, yeast_max = summary['yeast_range']
    lines.append(f"Yeast Concentration Range: {yeast_min:.3f}% - {yeast_max:.3f}%")
    
    time_min, time_max = summary['time_range']
    lines.append(f"Fermentation Time Range: {time_min:.1f}h - {time_max:.1f}h")
    
    return "\n".join(lines)

def main():
    """Main entry point."""
    parser = create_parser()
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(args.verbose)
    
    # Validate data path
    data_path = Path(args.data_path)
    if not data_path.exists():
        print(f"❌ Error: Data file not found: {data_path}")
        print("Please ensure the fermentation data CSV file exists.")
        sys.exit(1)
    
    # Initialize predictor
    try:
        predictor = FermentationPredictor(
            data_path=str(data_path),
            model_dir=args.model_dir
        )
    except Exception as e:
        print(f"❌ Error initializing predictor: {e}")
        sys.exit(1)
    
    # Handle different actions
    try:
        if args.train:
            print("🏗️  Training models...")
            predictor.train_models(retrain=True)
            print("✅ Models trained successfully!")
            return
        
        if args.performance:
            print("📊 Calculating model performance...")
            performance = predictor.get_model_performance()
            output = format_performance_output(performance, args.output_format)
            print(output)
            return
        
        if args.data_summary:
            summary = predictor.get_data_summary()
            output = format_data_summary(summary, args.output_format)
            print(output)
            return
        
        # Count provided parameters
        params_provided = sum([
            args.temperature is not None,
            args.yeast_concentration is not None,
            args.fermentation_time is not None
        ])
        
        if params_provided == 0:
            print("❌ Error: No action specified.")
            print("Provide 2 parameters for prediction, or use --train, --performance, or --data-summary")
            parser.print_help()
            sys.exit(1)
        
        if params_provided != 2:
            print("❌ Error: Exactly 2 of 3 parameters must be provided for prediction.")
            print("Parameters: --temp, --yeast, --time")
            sys.exit(1)
        
        # Make prediction
        print("🔮 Making prediction...")
        result = predictor.predict(
            temperature=args.temperature,
            yeast_concentration=args.yeast_concentration,
            fermentation_time=args.fermentation_time
        )
        
        # Format and display result
        output = format_prediction_output(result, args.output_format)
        print(output)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()