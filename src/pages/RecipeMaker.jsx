import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Button } from '../components/ui/Button.jsx';
import { TabContent } from '../components/ui/TabContent.jsx';
import { RecipeHeader } from '../components/recipe/RecipeHeader.jsx';
import { MainDoughSection } from '../components/recipe/MainDoughSection.jsx';
import { StepsSection } from '../components/recipe/StepsSection.jsx';
import { AddonSearchSection } from '../components/recipe/AddonSearchSection.jsx';
import { RecipeDisplay } from '../components/recipe/RecipeDisplay.jsx';
import { Section } from '../components/ui/Section.jsx';
import { recipeCalculations } from '../scripts/recipeCalculations.js';

// Available addons data
const availableAddons = [
  { id: 'tangzhong', name: 'TangZhong', section: 'addons' },
  { id: 'whole-wheat-flour', name: 'Whole Wheat Flour', section: 'addons' },
  { id: 'oil', name: 'Oil', section: 'addons' },
  { id: 'milk', name: 'Milk (90% water)', section: 'addons' },
  { id: 'sugar', name: 'Sugar', section: 'addons' },
  { id: 'butter', name: 'Butter', section: 'addons' },
  { id: 'eggs', name: 'Eggs', section: 'addons' },
  { id: 'baking-powder', name: 'Baking Powder', section: 'addons' },
  { id: 'cold-fermentation', name: 'Cold Fermentation (CF)', section: 'processes' },
  { id: 'room-temp-fermentation', name: 'Room Temperature (RT) Fermentation', section: 'processes' }
];

export function RecipeMaker({ active }) {
  // Recipe state
  const [recipeName, setRecipeName] = useState('New Recipe');
  const [recipeData, setRecipeData] = useState({
    doughPortions: 1,
    portionWeight: 500,
    hydrationPercent: 72,
    saltPercent: 2.2,
    leaveningType: 'active-dry-yeast',
    yeastPercent: 0.210,
    inoculatedFlourPercent: 0,
    prefermentHydration: 100
  });

  // Addon state
  const [activeAddons, setActiveAddons] = useState(new Set());
  const [addonData, setAddonData] = useState({});
  
  // Steps state
  const [steps, setSteps] = useState([]);
  
  // Calculated results
  const [calculatedData, setCalculatedData] = useState(null);

  // Derived state
  const showPreferment = recipeData.leaveningType === 'sourdough-starter' || 
                        recipeData.leaveningType === 'poolish';

  // Default yeast percentages
  const defaultYeastPercentages = {
    'active-dry-yeast': 0.210,
    'instant-yeast': 0.158,
    'cake-yeast': 0.630,
    'sourdough-starter': 4.200,
    'poolish': 0.032
  };

  // Handle main recipe data changes
  const handleRecipeChange = (field, value) => {
    setRecipeData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Update yeast percentage when leavening type changes
      if (field === 'leaveningType') {
        newData.yeastPercent = defaultYeastPercentages[value] || 0.210;
        
        // Set preferment defaults
        if (value === 'sourdough-starter') {
          newData.inoculatedFlourPercent = 20;
          newData.prefermentHydration = 100;
        } else if (value === 'poolish') {
          newData.inoculatedFlourPercent = 30;
          newData.prefermentHydration = 100;
        }
      }
      
      return newData;
    });
  };

  // Handle addon addition
  const handleAddAddon = (addonId) => {
    const addon = availableAddons.find(a => a.id === addonId);
    if (!addon || activeAddons.has(addonId)) return;

    setActiveAddons(prev => new Set([...prev, addonId]));
    
    // Initialize addon data based on type
    let initialData = { amount: 0 };
    
    switch (addonId) {
      case 'tangzhong':
        initialData = { flour: 0, hydration: 200 };
        break;
      case 'whole-wheat-flour':
        initialData = { amount: 0, percentage: 'g' };
        break;
      default:
        initialData = { amount: 0 };
    }
    
    setAddonData(prev => ({
      ...prev,
      [addonId]: initialData
    }));
  };

  // Handle addon removal
  const handleRemoveAddon = (addonId) => {
    setActiveAddons(prev => {
      const newSet = new Set(prev);
      newSet.delete(addonId);
      return newSet;
    });
    
    setAddonData(prev => {
      const newData = { ...prev };
      delete newData[addonId];
      return newData;
    });
  };

  // Handle addon data changes
  const handleAddonChange = (addonId, field, value) => {
    setAddonData(prev => ({
      ...prev,
      [addonId]: {
        ...prev[addonId],
        [field]: value
      }
    }));
  };

  // Calculate recipe
  const calculateRecipe = () => {
    const data = {
      recipeName,
      mandatory: recipeData,
      addons: addonData
    };

    const { mandatory, addons } = data;
    
    // Get addon amounts
    const wholeWheatFlour = addons['whole-wheat-flour']?.amount || 0;
    const tangzhongData = addons['tangzhong'] ? 
      recipeCalculations.calculateTangZhong(addons['tangzhong'].flour, addons['tangzhong'].hydration) :
      { flour: 0, water: 0 };

    // Calculate base amounts
    const estimatedTotalFlour = mandatory.doughPortions * mandatory.portionWeight / (1 + mandatory.hydrationPercent / 100);
    const flourNeeded = Math.max(0, estimatedTotalFlour - wholeWheatFlour - tangzhongData.flour);
    
    const totalFlour = flourNeeded + wholeWheatFlour + tangzhongData.flour;
    const water = recipeCalculations.calculateWater(totalFlour, mandatory.hydrationPercent) - tangzhongData.water;
    const salt = recipeCalculations.calculateSalt(totalFlour, mandatory.saltPercent);
    const yeast = recipeCalculations.calculateYeast(totalFlour, mandatory.yeastPercent, mandatory.leaveningType);

    // Calculate preferment if applicable
    let preferment = { flour: 0, water: 0 };
    if (mandatory.inoculatedFlourPercent) {
      preferment = recipeCalculations.calculatePreferment(
        totalFlour, 
        mandatory.inoculatedFlourPercent, 
        mandatory.prefermentHydration
      );
    }

    const result = {
      ingredients: {
        flour: Math.round(flourNeeded * 10) / 10,
        water: Math.round(Math.max(0, water) * 10) / 10,
        salt: Math.round(salt * 10) / 10,
        yeast: Math.round(yeast * 10) / 10,
        wholeWheatFlour: wholeWheatFlour,
        tangzhong: tangzhongData,
        preferment,
        addons: Object.keys(addons).reduce((acc, key) => {
          if (key !== 'tangzhong' && key !== 'whole-wheat-flour') {
            acc[key] = addons[key];
          }
          return acc;
        }, {})
      },
      stats: {
        totalFlour: Math.round(totalFlour * 10) / 10,
        totalWeight: Math.round((totalFlour + water + salt + yeast + wholeWheatFlour + Object.values(addons).reduce((sum, addon) => sum + (addon.amount || 0), 0)) * 10) / 10,
        actualHydration: Math.round((water / totalFlour * 100) * 10) / 10
      }
    };

    setCalculatedData(result);
  };

  // Recalculate when data changes
  useEffect(() => {
    calculateRecipe();
  }, [recipeData, addonData]);

  // Share recipe
  const shareRecipe = () => {
    const data = {
      recipeName,
      mandatory: recipeData,
      addons: addonData,
      steps: steps
    };
    
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?recipe=${encodedData}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Recipe URL copied to clipboard!');
      });
    } else {
      prompt('Copy this URL to share your recipe:', url);
    }
  };

  // Copy recipe JSON
  const copyRecipeJson = () => {
    const data = {
      recipeName,
      mandatory: recipeData,
      addons: addonData,
      steps: steps
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonString).then(() => {
        alert('Recipe JSON copied to clipboard!');
      });
    } else {
      alert('Clipboard not supported');
    }
  };

  // Render addon inputs
  const renderAddonInputs = () => {
    return Array.from(activeAddons).map(addonId => {
      const addon = availableAddons.find(a => a.id === addonId);
      const data = addonData[addonId] || {};
      
      return (
        <div key={addonId} className="addon-item">
          <label className="addon-label">{addon.name}:</label>
          
          {addonId === 'tangzhong' ? (
            <div className="addon-inputs">
              <div className="input-group">
                <input 
                  type="number" 
                  min="0" 
                  step="0.1" 
                  value={data.flour || ''}
                  onChange={(e) => handleAddonChange(addonId, 'flour', parseFloat(e.target.value) || 0)}
                />
                <span className="unit">Flour (g)</span>
              </div>
              <div className="input-group">
                <input 
                  type="number" 
                  min="0" 
                  step="0.1" 
                  value={data.hydration || 200}
                  onChange={(e) => handleAddonChange(addonId, 'hydration', parseFloat(e.target.value) || 200)}
                />
                <span className="unit">Hydration (% of tangzhong flour)</span>
              </div>
            </div>
          ) : addonId === 'whole-wheat-flour' ? (
            <div className="addon-inputs">
              <div className="input-group">
                <input 
                  type="number" 
                  min="0" 
                  step="0.1" 
                  value={data.amount || ''}
                  onChange={(e) => handleAddonChange(addonId, 'amount', parseFloat(e.target.value) || 0)}
                />
                <select 
                  value={data.percentage || 'g'}
                  onChange={(e) => handleAddonChange(addonId, 'percentage', e.target.value)}
                >
                  <option value="percent">% of all flour</option>
                  <option value="grams">g</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="addon-inputs">
              <div className="input-group">
                <input 
                  type="number" 
                  min="0" 
                  step="0.1" 
                  value={data.amount || ''}
                  onChange={(e) => handleAddonChange(addonId, 'amount', parseFloat(e.target.value) || 0)}
                />
                <span className="unit">g</span>
              </div>
            </div>
          )}
          <button 
            className="remove-btn" 
            onClick={() => handleRemoveAddon(addonId)}
            title="Remove"
          >
            ×
          </button>
        </div>
      );
    });
  };

  return (
    <TabContent id="recipe-maker" active={active}>
      <RecipeHeader 
        recipeName={recipeName} 
        onNameChange={setRecipeName} 
      />
      
      <MainDoughSection
        doughPortions={recipeData.doughPortions}
        portionWeight={recipeData.portionWeight}
        hydrationPercent={recipeData.hydrationPercent}
        saltPercent={recipeData.saltPercent}
        leaveningType={recipeData.leaveningType}
        yeastPercent={recipeData.yeastPercent}
        showPreferment={showPreferment}
        inoculatedFlourPercent={recipeData.inoculatedFlourPercent}
        prefermentHydration={recipeData.prefermentHydration}
        onChange={handleRecipeChange}
      />
      
      <StepsSection
        steps={steps}
        onStepsChange={setSteps}
      />
      
      <AddonSearchSection
        availableAddons={availableAddons}
        activeAddons={activeAddons}
        onAddAddon={handleAddAddon}
      />
      
      {activeAddons.size > 0 && (
        <Section 
          title="✨ Add-ons" 
          id="addonsSection"
        >
          {renderAddonInputs()}
        </Section>
      )}
      
      <RecipeDisplay calculatedData={calculatedData} />
      
      <section className="debug-section">
        <h3>🔧 Debug JSON</h3>
        <textarea 
          readOnly 
          placeholder="Recipe data will appear here..."
          value={JSON.stringify({ recipeName, mandatory: recipeData, addons: addonData, steps: steps }, null, 2)}
        />
        <div className="debug-controls">
          <Button onClick={shareRecipe}>
            📋 Share Recipe URL
          </Button>
          <Button onClick={copyRecipeJson}>
            📄 Copy JSON
          </Button>
        </div>
      </section>
    </TabContent>
  );
}