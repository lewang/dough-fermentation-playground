// Step templates for recipe creation
import { availableIngredients } from './ingredients.js';

// Helper function to create ingredient with defaults
const createIngredient = (name, defaultValue, unit = 'g') => {
  const baseIngredient = availableIngredients.find(ing => ing.name === name);
  return {
    name: name,
    type: baseIngredient?.type || 'generic',
    unit: unit,
    defaultValue: defaultValue
  };
};

export const stepTemplates = [
  {
    name: "TangZhong",
    defaultDuration: "5 minutes",
    temperature: 2,
    ingredients: [
      createIngredient("flour", 50),
      createIngredient("boiling water", 100)
    ]
  },
  {
    name: "Stretch and Fold",
    defaultDuration: "20 minutes",
    reps: 4
  },
  {
    name: "Cold Fermentation",
    defaultDuration: "18 h",
    temperature: 2
  },
  {
    name: "Autolyse",
    defaultDuration: "30 minutes",
    ingredients: [
      createIngredient("flour", 500),
      createIngredient("water", 360)
    ]
  },
  {
    name: "Mix Dough",
    defaultDuration: "10 minutes"
  },
  {
    name: "Bulk Fermentation", 
    defaultDuration: "4 hours",
    temperature: 24
  },
  {
    name: "Pre-shape",
    defaultDuration: "15 minutes"
  },
  {
    name: "Final Shape",
    defaultDuration: "10 minutes"
  },
  {
    name: "Final Proof",
    defaultDuration: "2 hours",
    temperature: 24
  },
  {
    name: "Bake",
    defaultDuration: "35 minutes",
    temperature: 230
  }
];