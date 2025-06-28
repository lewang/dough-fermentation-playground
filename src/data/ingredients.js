// Available ingredients for recipe creation
export const availableIngredients = [
  { "name": "Flour", "type": "flour" },
  { "name": "Boiling water", "type": "water" },
  { "name": "Whole Wheat Flour", "type": "flour" },
  { "name": "Oil" },
  { "name": "Milk (90% water)", "type": "water", "scaling": 0.9 },
  { "name": "Sugar" },
  { "name": "Butter" },
  { "name": "Eggs", "type": "water", "scaling": 0.75 },
  { "name": "Baking Powder" },
  { "name": "Water room temp", "type": "water" },
  { "name": "Salt" },
  { "name": "Active Dry Yeast" },
  { "name": "Instant Yeast" },
  { "name": "Cake Yeast" },
  { "name": "Sourdough Starter (100% hydration)" },
  { "name": "Poolish (100% hydration)" }
];

/**
 * Get ingredient suggestions filtered by query
 * @param {string} query - Search query
 * @returns {Array} - Filtered ingredients
 */
export function getIngredientSuggestions(query = '') {
  if (!query.trim()) return availableIngredients;
  
  const lowerQuery = query.toLowerCase();
  return availableIngredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Create a new ingredient object with defaults
 * @param {Object} baseIngredient - Base ingredient from availableIngredients
 * @param {number} defaultValue - Default value from step template
 * @returns {Object} - Complete ingredient object for step
 */
export function createStepIngredient(baseIngredient, defaultValue = 0) {
  return {
    name: baseIngredient.name,
    type: baseIngredient.type || 'generic',
    unit: 'g', // Default unit
    defaultValue: defaultValue,
    value: defaultValue,
    scaling: baseIngredient.scaling
  };
}
