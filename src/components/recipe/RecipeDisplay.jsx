import { h } from 'preact';

export function RecipeDisplay({ calculatedData }) {
  if (!calculatedData) return null;

  const { ingredients, stats } = calculatedData;

  const formatName = (key) => {
    return key.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <section className="recipe-output">
      <h2>📋 Recipe</h2>
      <div className="recipe-display">
        <div className="ingredient-list">
          <h3>🍞 Main Dough Ingredients</h3>
          <div className="ingredient">
            <span className="ingredient-name">Bread Flour</span>
            <span className="ingredient-amount">{ingredients.flour}g</span>
          </div>
          
          {ingredients.wholeWheatFlour > 0 && (
            <div className="ingredient">
              <span className="ingredient-name">Whole Wheat Flour</span>
              <span className="ingredient-amount">{ingredients.wholeWheatFlour}g</span>
            </div>
          )}
          
          <div className="ingredient">
            <span className="ingredient-name">Water</span>
            <span className="ingredient-amount">{ingredients.water}g</span>
          </div>
          <div className="ingredient">
            <span className="ingredient-name">Salt</span>
            <span className="ingredient-amount">{ingredients.salt}g</span>
          </div>
          <div className="ingredient">
            <span className="ingredient-name">Yeast</span>
            <span className="ingredient-amount">{ingredients.yeast}g</span>
          </div>
        </div>

        {ingredients.tangzhong && ingredients.tangzhong.flour > 0 && (
          <div className="ingredient-list">
            <h3>🌾 TangZhong</h3>
            <div className="ingredient">
              <span className="ingredient-name">Flour</span>
              <span className="ingredient-amount">{ingredients.tangzhong.flour}g</span>
            </div>
            <div className="ingredient">
              <span className="ingredient-name">Water</span>
              <span className="ingredient-amount">{ingredients.tangzhong.water}g</span>
            </div>
          </div>
        )}

        {Object.keys(ingredients.addons || {}).length > 0 && (
          <div className="ingredient-list">
            <h3>✨ Additional Ingredients</h3>
            {Object.entries(ingredients.addons).map(([key, addon]) => {
              if (addon.amount > 0) {
                return (
                  <div key={key} className="ingredient">
                    <span className="ingredient-name">{formatName(key)}</span>
                    <span className="ingredient-amount">{addon.amount}g</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        <div className="recipe-stats">
          <div className="recipe-stat">
            <div className="stat-value">{stats.totalFlour}g</div>
            <div className="stat-label">Total Flour</div>
          </div>
          <div className="recipe-stat">
            <div className="stat-value">{stats.totalWeight}g</div>
            <div className="stat-label">Total Weight</div>
          </div>
          <div className="recipe-stat">
            <div className="stat-value">{stats.actualHydration}%</div>
            <div className="stat-label">Actual Hydration</div>
          </div>
        </div>
      </div>
    </section>
  );
}