import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../components/ui/Button.jsx';
import { TabContent } from '../components/ui/TabContent.jsx';
import { InputGroup } from '../components/inputs/InputGroup.jsx';
import { InputRow } from '../components/inputs/InputRow.jsx';

export function FermentationPredictor({ active }) {
  const [temperature, setTemperature] = useState('');
  const [yeast, setYeast] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const calculateFermentation = () => {
    // Clear previous results
    setResult(null);
    setError(null);
    
    // Validation logic would go here
    console.log('Calculate fermentation with:', { temperature, yeast, time });
    
    // Mock calculation for now
    setResult('Fermentation calculation results would appear here');
  };

  const clearInputs = () => {
    setTemperature('');
    setYeast('');
    setTime('');
    setResult(null);
    setError(null);
  };

  return (
    <TabContent id="fermentation" active={active}>
      <h1 className="text-center">🧪 Fermentation Predictor</h1>
      <p className="text-center text-grey">
        Enter any 2 parameters to predict the third using the Arrhenius kinetics model
      </p>
      
      <div className="row">
        <div className="col-6">
          <InputGroup
            label="Temperature (°C)"
            type="number"
            value={temperature}
            onChange={setTemperature}
            step="0.1"
            min="1"
            max="50"
            placeholder="e.g., 15.0"
          />
          <small className="text-grey">Range: 1-50°C</small>
        </div>
        
        <div className="col-6">
          <InputGroup
            label="Yeast Concentration (%)"
            type="number"
            value={yeast}
            onChange={setYeast}
            step="0.001"
            min="0.001"
            max="1"
            placeholder="e.g., 0.1"
          />
          <small className="text-grey">Range: 0.001-1.0%</small>
        </div>
      </div>
      
      <div className="row">
        <div className="col">
          <InputGroup
            label="Fermentation Time (hours)"
            type="number"
            value={time}
            onChange={setTime}
            step="0.1"
            min="0.1"
            max="500"
            placeholder="e.g., 50"
          />
          <small className="text-grey">Range: 0.1-500 hours</small>
        </div>
      </div>
      
      <div className="text-center" style={{ margin: '2rem 0' }}>
        <Button variant="primary" onClick={calculateFermentation}>
          🧪 Calculate
        </Button>
        <Button onClick={clearInputs}>
          Clear
        </Button>
      </div>
      
      {result && (
        <div className="result-box show">
          <div>{result}</div>
        </div>
      )}
      
      {error && (
        <div className="error-box show">
          <div>{error}</div>
        </div>
      )}
    </TabContent>
  );
}