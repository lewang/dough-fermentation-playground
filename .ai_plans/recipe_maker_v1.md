# Recipe Maker Implementation Plan v1

## Overview
Create a comprehensive bread recipe calculator called "Recipe Maker" that handles baker's percentages, ingredient scaling, and complex bread formulations with optional components.

## 1. HTML Structure Updates

### Navigation
- **Add new tab**: Insert "Recipe Maker" as leftmost tab in navigation
- **Tab order**: Recipe Maker → Fermentation Predictor → Model Optimization → Advanced Models
- **Default tab**: Recipe Maker becomes the default active tab

### Main Layout Structure
```html
<div id="recipe-maker" class="tab-content active">
  <div class="content-container">
    <h1 class="recipe-name" onclick="editRecipeName()">Click to Edit Recipe Name</h1>
    
    <!-- Section 1: Mandatory Inputs -->
    <section class="recipe-section mandatory">
      <h2>🍞 Main Dough</h2>
      <!-- Input fields -->
    </section>
    
    <!-- Section 2: TangZhong (Optional) -->
    <section class="recipe-section tangzhong" style="display: none;">
      <h2>🌾 TangZhong</h2>
      <!-- TangZhong inputs -->
    </section>
    
    <!-- Section 3: Addons (Optional) -->
    <section class="recipe-section addons" style="display: none;">
      <h2>✨ Add-ons</h2>
      <!-- Dynamic addon inputs -->
    </section>
    
    <!-- Section 4: Processes (Optional) -->
    <section class="recipe-section processes" style="display: none;">
      <h2>⏰ Processes</h2>
      <!-- Process inputs -->
    </section>
    
    <!-- Recipe Output -->
    <section class="recipe-output">
      <h2>📋 Recipe</h2>
      <!-- Calculated ingredients list -->
    </section>
    
    <!-- Debug & Share -->
    <section class="debug-section">
      <h3>🔧 Debug JSON</h3>
      <textarea id="recipeJson" readonly></textarea>
      <button onclick="shareRecipe()">📋 Share Recipe URL</button>
    </section>
  </div>
</div>
```

## 2. Input Field Components

### Mandatory Inputs Section
```html
<!-- Recipe Name (editable header) -->
<h1 class="recipe-name editable" onclick="editRecipeName()">New Recipe</h1>

<!-- Dough Portions -->
<label>Dough Portions:</label>
<input type="number" id="doughPortions" value="1" min="1" onchange="updateRecipe()">

<!-- Portion Weight -->
<label>Portion Weight:</label>
<input type="number" id="portionWeight" value="500" min="1"> g

<!-- Hydration -->
<label>Hydration:</label>
<input type="number" id="hydration" value="72" min="1" max="200" step="0.1"> %

<!-- Salt -->
<label>Salt:</label>
<input type="number" id="saltPercent" value="2.2" min="0" max="10" step="0.1"> %

<!-- Leavening Dropdown -->
<label>Leavening:</label>
<select id="leaveningType" onchange="updateLeaveningInputs()">
  <option value="active-dry-yeast">Active Dry Yeast</option>
  <option value="instant-yeast">Instant Yeast</option>
  <option value="cake-yeast">Cake Yeast</option>
  <option value="sourdough-starter">Sourdough Starter</option>
  <option value="poolish">Poolish</option>
</select>

<!-- Conditional Yeast Input -->
<div id="yeastInputs" style="display: block;">
  <label>Yeast %:</label>
  <input type="number" id="yeastPercent" value="0.210" step="0.001"> %
</div>

<!-- Conditional Preferment Inputs -->
<div id="prefermentInputs" style="display: none;">
  <label>Inoculated Flour % of Whole:</label>
  <input type="number" id="inoculatedFlourPercent" step="0.1"> %
  
  <label>Preferment Hydration:</label>
  <input type="number" id="prefermentHydration" step="0.1"> %
</div>
```

### Add-on Autocomplete System
```html
<label>Add Ingredients/Processes:</label>
<input type="text" id="addonSearch" placeholder="Type to add: TangZhong, Whole Wheat Flour, Oil, etc."
       oninput="showAddonSuggestions(this.value)" 
       onkeydown="handleAddonKeydown(event)">
<div id="addonSuggestions" class="suggestions-dropdown"></div>
```

### Dynamic Add-on Sections
Each add-on type creates specific input fields:

**TangZhong:**
```html
<div class="addon-item" data-type="tangzhong">
  <label>TangZhong Flour:</label>
  <input type="number" id="tangzhongFlour"> g
  
  <label>TangZhong Hydration:</label>
  <input type="number" id="tangzhongHydration" value="200"> %
</div>
```

**Whole Wheat Flour:**
```html
<div class="addon-item" data-type="whole-wheat-flour">
  <label>Whole Wheat Flour:</label>
  <input type="number" id="wholeWheatAmount">
  <select id="wholeWheatUnit">
    <option value="percent">% of all flour</option>
    <option value="grams">g</option>
  </select>
</div>
```

## 3. Calculation Engine

### Core Formulas
```javascript
const recipeCalculations = {
  // Baker's percentage base calculations
  calculateFlour: (portions, portionWeight, hydration, wholeWheatFlour = 0) => {
    const totalWeight = portions * portionWeight;
    const flourWeight = totalWeight / (1 + hydration / 100);
    return flourWeight - wholeWheatFlour;
  },
  
  calculateWater: (totalFlour, hydration) => {
    return totalFlour * (hydration / 100);
  },
  
  calculateSalt: (totalFlour, saltPercent) => {
    return totalFlour * (saltPercent / 100);
  },
  
  // Yeast scaling factors
  yeastScaling: {
    'active-dry-yeast': 1.0,
    'instant-yeast': 0.762,
    'cake-yeast': 2.38
  },
  
  calculateYeast: (totalFlour, yeastPercent, yeastType) => {
    const baseAmount = totalFlour * (yeastPercent / 100);
    return baseAmount * recipeCalculations.yeastScaling[yeastType];
  }
};
```

### Real-time Update System
```javascript
function updateRecipe() {
  const recipe = collectRecipeData();
  const calculations = performCalculations(recipe);
  updateRecipeDisplay(calculations);
  updateDebugJson(recipe);
  updateURL(recipe);
}

// Trigger on any input change
document.addEventListener('input', updateRecipe);
document.addEventListener('change', updateRecipe);
```

## 4. Dynamic Section Management

### Add-on Suggestion System
```javascript
const availableAddons = [
  { id: 'tangzhong', name: 'TangZhong', section: 'tangzhong' },
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

function addIngredient(addonId) {
  const addon = availableAddons.find(a => a.id === addonId);
  createAddonInputs(addon);
  showSection(addon.section);
  updateRecipe();
}
```

### Section Visibility Management
```javascript
function showSection(sectionName) {
  const section = document.querySelector(`.recipe-section.${sectionName}`);
  if (section) {
    section.style.display = 'block';
  }
}

function hideSection(sectionName) {
  const section = document.querySelector(`.recipe-section.${sectionName}`);
  if (section && !hasSectionContent(sectionName)) {
    section.style.display = 'none';
  }
}
```

## 5. Recipe Output Display

### Ingredients List Format
```javascript
function generateRecipeDisplay(calculations) {
  return `
    <div class="ingredient-list">
      <h3>Ingredients</h3>
      <div class="ingredient">Flour: ${calculations.flour.toFixed(1)}g</div>
      ${calculations.wholeWheatFlour ? `<div class="ingredient">Whole Wheat Flour: ${calculations.wholeWheatFlour.toFixed(1)}g</div>` : ''}
      <div class="ingredient">Water: ${calculations.water.toFixed(1)}g</div>
      <div class="ingredient">${calculations.leaveningType}: ${calculations.leavening.toFixed(2)}g</div>
      <div class="ingredient">Salt: ${calculations.salt.toFixed(1)}g</div>
      ${generateAddonsList(calculations.addons)}
    </div>
    
    <div class="recipe-stats">
      <div>Total Flour: ${calculations.totalFlour.toFixed(1)}g</div>
      <div>Total Weight: ${calculations.totalWeight.toFixed(1)}g</div>
      <div>Hydration: ${calculations.actualHydration.toFixed(1)}%</div>
    </div>
  `;
}
```

## 6. JSON Serialization & URL Sharing

### Recipe Data Structure
```javascript
const recipeSchema = {
  name: "string",
  mandatory: {
    doughPortions: "number",
    portionWeight: "number", 
    hydration: "number",
    saltPercent: "number",
    leaveningType: "string",
    yeastPercent: "number", // if yeast
    inoculatedFlourPercent: "number", // if preferment
    prefermentHydration: "number" // if preferment
  },
  tangzhong: {
    flour: "number",
    hydration: "number"
  },
  addons: {
    wholeWheatFlour: { amount: "number", unit: "string" },
    oil: "number",
    milk: "number",
    sugar: "number",
    butter: "number",
    eggs: "number",
    bakingPowder: "number"
  },
  processes: {
    coldFermentation: { temperature: "number", duration: "string" },
    roomTempFermentation: { temperature: "number", duration: "string" }
  }
};
```

### URL Compression Strategy
```javascript
function compressRecipeForUrl(recipe) {
  // Remove default values and empty fields
  const compressed = removeDefaults(recipe);
  // Use short keys to minimize URL size
  const shortKeys = {
    'name': 'n',
    'doughPortions': 'dp',
    'portionWeight': 'pw',
    'hydration': 'h',
    'saltPercent': 'sp',
    // ... etc
  };
  const shortened = transformKeys(compressed, shortKeys);
  return btoa(JSON.stringify(shortened));
}

function shareRecipe() {
  const recipe = collectRecipeData();
  const compressed = compressRecipeForUrl(recipe);
  const url = `${window.location.origin}${window.location.pathname}?recipe=${compressed}`;
  navigator.clipboard.writeText(url);
  alert('Recipe URL copied to clipboard!');
}
```

### URL Loading
```javascript
function loadRecipeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeData = urlParams.get('recipe');
  
  if (recipeData) {
    try {
      const compressed = JSON.parse(atob(recipeData));
      const recipe = expandRecipeData(compressed);
      populateForm(recipe);
      updateRecipe();
    } catch (error) {
      console.warn('Failed to load recipe from URL:', error);
    }
  }
}
```

## 7. UI/UX Features

### Validation & Feedback
```javascript
function validateInput(inputElement) {
  const value = parseFloat(inputElement.value);
  const min = parseFloat(inputElement.min) || 0;
  const max = parseFloat(inputElement.max) || Infinity;
  
  if (isNaN(value) || value < min || value > max) {
    inputElement.classList.add('invalid');
    return false;
  } else {
    inputElement.classList.remove('invalid');
    return true;
  }
}
```

### Duration Parsing Integration
```javascript
function parseDuration(durationText) {
  // Reuse existing parseDuration function from gantt.html
  const ms = parseDuration(durationText);
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return { hours, minutes, ms, text: formatDuration(ms) };
}

function validateDurationInput(inputElement) {
  try {
    const parsed = parseDuration(inputElement.value);
    inputElement.classList.remove('invalid');
    // Show parsed result as helper text
    const helper = inputElement.nextElementSibling;
    if (helper && helper.classList.contains('duration-helper')) {
      helper.textContent = `= ${parsed.text}`;
      helper.style.color = 'var(--color-success)';
    }
    return true;
  } catch (error) {
    inputElement.classList.add('invalid');
    return false;
  }
}
```

## 8. CSS Styling Requirements

### Section Styling
```css
.recipe-section {
  background: var(--surface-secondary);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.recipe-section h2 {
  margin-top: 0;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.addon-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background: var(--surface-color);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
```

### Validation Styling
```css
input.invalid {
  border-color: var(--color-error);
  background: rgba(220, 53, 69, 0.1);
}

.duration-helper {
  font-size: 0.8rem;
  margin-left: 0.5rem;
  font-style: italic;
}

.suggestions-dropdown {
  position: absolute;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}
```

## 9. Implementation Order

1. **Tab structure & navigation** - Add Recipe Maker tab as default
2. **Mandatory inputs section** - Core dough calculator functionality  
3. **Calculation engine** - Baker's percentage formulas and real-time updates
4. **Leavening system** - Dropdown with conditional inputs and scaling factors
5. **Add-on autocomplete** - Search and suggestion system
6. **Dynamic sections** - TangZhong, Add-ons, Processes with conditional visibility
7. **Recipe output display** - Formatted ingredients list with calculations
8. **JSON debug & URL sharing** - Serialization, compression, and URL encoding
9. **Validation & UX polish** - Input validation, duration parsing, error handling
10. **Mobile responsiveness** - Responsive grid layouts and mobile optimization

This plan creates a comprehensive bread recipe calculator that handles everything from simple loaves to complex enriched doughs with multiple fermentation processes.