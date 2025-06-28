// Step templates for recipe creation
export const stepTemplates = [
  {
    name: "TangZhong",
    defaultDuration: "5 minutes",
    temperature: 2,
    ingredients: [
      { name: "flour", type: "flour", unit: "g", defaultValue: 50 },
      { name: "boiling water", type: "water", unit: "g", defaultValue: 100 }
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
      { name: "flour", type: "flour", unit: "g", defaultValue: 500 },
      { name: "water", type: "water", unit: "g", defaultValue: 360 }
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