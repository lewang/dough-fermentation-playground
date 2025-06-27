import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Navigation } from './components/Navigation.jsx';
import { RecipeMaker } from './pages/RecipeMaker.jsx';
import { FermentationPredictor } from './pages/FermentationPredictor.jsx';
import { TabContent } from './components/ui/TabContent.jsx';
import './styles/main.css';

export function App() {
  const [activeTab, setActiveTab] = useState('recipe-maker');

  return (
    <div>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="main-content">
        <div className="container">
          <RecipeMaker active={activeTab === 'recipe-maker'} />
          <FermentationPredictor active={activeTab === 'fermentation'} />
          
          {/* Placeholder tabs */}
          <TabContent 
            id="optimization" 
            active={activeTab === 'optimization'}
          >
            <h1 className="text-center">📊 Model Optimization</h1>
            <p className="text-center text-grey">
              Model optimization features coming soon...
            </p>
          </TabContent>
          
          <TabContent 
            id="advanced" 
            active={activeTab === 'advanced'}
          >
            <h1 className="text-center">🤖 Advanced Models</h1>
            <p className="text-center text-grey">
              Advanced modeling features coming soon...
            </p>
          </TabContent>
        </div>
      </main>
    </div>
  );
}