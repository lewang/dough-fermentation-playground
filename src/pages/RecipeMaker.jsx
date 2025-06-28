import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Button } from '../components/ui/Button.jsx';
import { TabContent } from '../components/ui/TabContent.jsx';
import { RecipeHeader } from '../components/recipe/RecipeHeader.jsx';
import { MainDoughSection } from '../components/recipe/MainDoughSection.jsx';
import { StepsSection } from '../components/recipe/StepsSection.jsx';
import { RecipeDisplay } from '../components/recipe/RecipeDisplay.jsx';
import { Section } from '../components/ui/Section.jsx';
import { recipeCalculations } from '../scripts/recipeCalculations.js';
import { parseStepName } from '../utils/stepUtils.js';


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


  // Calculate recipe
  const calculateRecipe = () => {
    const { doughPortions, portionWeight, hydrationPercent, saltPercent, yeastPercent, leaveningType, inoculatedFlourPercent, prefermentHydration } = recipeData;
    
    // Calculate base amounts
    const estimatedTotalFlour = doughPortions * portionWeight / (1 + hydrationPercent / 100);
    const totalFlour = estimatedTotalFlour;
    const water = recipeCalculations.calculateWater(totalFlour, hydrationPercent);
    const salt = recipeCalculations.calculateSalt(totalFlour, saltPercent);
    const yeast = recipeCalculations.calculateYeast(totalFlour, yeastPercent, leaveningType);

    // Calculate preferment if applicable
    let preferment = { flour: 0, water: 0 };
    if (inoculatedFlourPercent) {
      preferment = recipeCalculations.calculatePreferment(
        totalFlour, 
        inoculatedFlourPercent, 
        prefermentHydration
      );
    }

    const result = {
      ingredients: {
        flour: Math.round(totalFlour * 10) / 10,
        water: Math.round(water * 10) / 10,
        salt: Math.round(salt * 10) / 10,
        yeast: Math.round(yeast * 10) / 10,
        preferment
      },
      stats: {
        totalFlour: Math.round(totalFlour * 10) / 10,
        totalWeight: Math.round((totalFlour + water + salt + yeast) * 10) / 10,
        actualHydration: Math.round((water / totalFlour * 100) * 10) / 10
      }
    };

    setCalculatedData(result);
  };

  // Recalculate when data changes
  useEffect(() => {
    calculateRecipe();
  }, [recipeData]);

  // Transform steps to include parsed group IDs
  const getStepsWithGroupIds = () => {
    return steps.map(step => {
      const { groupId, title } = parseStepName(step.name);
      return {
        ...step,
        groupId: groupId || null,
        displayTitle: title
      };
    });
  };

  // Share recipe
  const shareRecipe = () => {
    const data = {
      recipeName,
      mandatory: recipeData,
      steps: getStepsWithGroupIds()
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
      steps: getStepsWithGroupIds()
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
      
      
      <RecipeDisplay calculatedData={calculatedData} />
      
      <section className="debug-section">
        <h3>🔧 Debug JSON</h3>
        <textarea 
          readOnly 
          placeholder="Recipe data will appear here..."
          value={JSON.stringify({ recipeName, mandatory: recipeData, steps: getStepsWithGroupIds() }, null, 2)}
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