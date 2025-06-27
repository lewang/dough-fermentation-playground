import { recipeCalculations } from '../scripts/recipeCalculations.js';
import { AddonSystem } from '../scripts/addonSystem.js';

export class RecipeMaker {
    constructor() {
        this.recipeName = 'New Recipe';
        this.currentRecipeData = {};
        this.addonSystem = null;
    }

    render() {
        return `
            <div id="recipe-maker" class="tab-content active">
                <div class="content-container">
                    <div class="recipe-header">
                        <h1 class="recipe-name">${this.recipeName}</h1>
                        <span class="edit-icon" onclick="window.recipeMaker.editRecipeName()" title="Edit recipe name">✏️</span>
                    </div>
                    
                    <!-- Section 1: Mandatory Inputs -->
                    <section class="recipe-section mandatory">
                        <h2>🍞 Main Dough</h2>
                        <div class="recipe-inputs">
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="doughPortions">Dough Portions</label>
                                    <input type="number" id="doughPortions" value="1" min="1" onchange="window.recipeMaker.updateRecipe()">
                                </div>
                                <div class="input-group main-input">
                                    <label for="portionWeight">Portion Weight</label>
                                    <input type="number" id="portionWeight" value="500" min="1" onchange="window.recipeMaker.updateRecipe()">
                                    <span class="unit">g</span>
                                </div>
                            </div>
                            
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="hydrationPercent">Hydration</label>
                                    <input type="number" id="hydrationPercent" value="72" min="1" max="200" step="0.1" onchange="window.recipeMaker.updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                                <div class="input-group main-input">
                                    <label for="saltPercent">Salt</label>
                                    <input type="number" id="saltPercent" value="2.2" min="0" max="10" step="0.1" onchange="window.recipeMaker.updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                            </div>
                            
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="leaveningType">Leavening</label>
                                    <select id="leaveningType" onchange="window.recipeMaker.updateLeaveningInputs()">
                                        <option value="active-dry-yeast">Active Dry Yeast</option>
                                        <option value="instant-yeast">Instant Yeast</option>
                                        <option value="cake-yeast">Cake Yeast</option>
                                        <option value="sourdough-starter">Sourdough Starter</option>
                                        <option value="poolish">Poolish</option>
                                    </select>
                                </div>
                                <!-- Yeast % in same row as Leavening -->
                                <div id="yeastInputs" class="input-group main-input">
                                    <label for="yeastPercent">Yeast</label>
                                    <input type="number" id="yeastPercent" value="0.210" step="0.001" min="0" onchange="window.recipeMaker.updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                            </div>
                            
                            <!-- Conditional Preferment Inputs -->
                            <div id="prefermentInputs" class="conditional-inputs" style="display: none;">
                                <div class="input-row">
                                    <div class="input-group main-input">
                                        <label for="inoculatedFlourPercent">Inoculated Flour % of Whole</label>
                                        <input type="number" id="inoculatedFlourPercent" step="0.1" min="0" onchange="window.recipeMaker.updateRecipe()">
                                        <span class="unit">%</span>
                                    </div>
                                    <div class="input-group main-input">
                                        <label for="prefermentHydration">Preferment Hydration</label>
                                        <input type="number" id="prefermentHydration" step="0.1" min="0" onchange="window.recipeMaker.updateRecipe()">
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <!-- Add-on Search -->
                    <section class="addon-search-section">
                        <h2>✨ Add Ingredients/Processes</h2>
                        <div class="search-container">
                            <input type="text" id="addonSearch" placeholder="Type to add: TangZhong, Whole Wheat Flour, Oil, etc."
                                   oninput="window.addonSystem.showAddonSuggestions(this.value)" 
                                   onkeydown="window.addonSystem.handleAddonKeydown(event)"
                                   onclick="window.addonSystem.showAddonSuggestions(this.value)"
                                   onfocus="window.addonSystem.showAddonSuggestions(this.value)">
                            <div id="addonSuggestions" class="suggestions-dropdown"></div>
                        </div>
                    </section>
                    
                    <!-- Section 2: Addons (Optional) -->
                    <section class="recipe-section addons" id="addonsSection" style="display: none;">
                        <h2>✨ Add-ons</h2>
                        <div id="addonsList" class="recipe-inputs">
                            <!-- Dynamic addon inputs will be added here -->
                        </div>
                    </section>
                    
                    <!-- Section 3: Processes (Optional) -->
                    <section class="recipe-section processes" id="processesSection" style="display: none;">
                        <h2>⏰ Processes</h2>
                        <div id="processesList" class="recipe-inputs">
                            <!-- Dynamic process inputs will be added here -->
                        </div>
                    </section>
                    
                    <!-- Recipe Output -->
                    <section class="recipe-output">
                        <h2>📋 Recipe</h2>
                        <div id="recipeDisplay" class="recipe-display">
                            <!-- Calculated ingredients will appear here -->
                        </div>
                    </section>
                    
                    <!-- Debug & Share -->
                    <section class="debug-section">
                        <h3>🔧 Debug JSON</h3>
                        <textarea id="recipeJson" readonly placeholder="Recipe data will appear here..."></textarea>
                        <div class="debug-controls">
                            <button class="button" onclick="window.recipeMaker.shareRecipe()">📋 Share Recipe URL</button>
                            <button class="button" onclick="window.recipeMaker.copyRecipeJson()">📄 Copy JSON</button>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Make recipe maker available globally
        window.recipeMaker = this;
        
        // Initialize addon system
        this.addonSystem = new AddonSystem(() => this.updateRecipe());
        window.addonSystem = this.addonSystem;

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                document.getElementById('addonSuggestions')?.classList.remove('show');
            }
        });

        // Initial recipe calculation
        setTimeout(() => this.updateRecipe(), 100);
    }

    editRecipeName() {
        const recipeName = document.querySelector('.recipe-name');
        const currentName = recipeName.textContent;
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'recipe-name-edit';
        input.style.cssText = `
            background: transparent;
            border: 2px solid var(--color-primary);
            color: inherit;
            font: inherit;
            padding: 0.25rem;
            border-radius: 4px;
            width: 100%;
        `;
        
        // Replace h1 with input
        recipeName.replaceWith(input);
        input.focus();
        input.select();
        
        const finishEdit = (save = true) => {
            const newInput = document.querySelector('.recipe-name-edit');
            if (!newInput) return;
            
            const newName = save && newInput.value.trim() ? newInput.value.trim() : currentName;
            this.recipeName = newName;
            
            const newH1 = document.createElement('h1');
            newH1.className = 'recipe-name';
            newH1.textContent = newName;
            
            newInput.replaceWith(newH1);
        };
        
        input.addEventListener('blur', () => finishEdit(true));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit(true);
            if (e.key === 'Escape') finishEdit(false);
        });
    }

    updateLeaveningInputs() {
        const leaveningType = document.getElementById('leaveningType').value;
        const prefermentInputs = document.getElementById('prefermentInputs');
        const yeastInput = document.getElementById('yeastPercent');
        
        // Default yeast percentages
        const defaultYeastPercentages = {
            'active-dry-yeast': 0.210,
            'instant-yeast': 0.158,
            'cake-yeast': 0.630,
            'sourdough-starter': 4.200,
            'poolish': 0.032
        };
        
        // Update yeast percentage
        if (defaultYeastPercentages[leaveningType]) {
            yeastInput.value = defaultYeastPercentages[leaveningType].toFixed(3);
        }
        
        // Show/hide preferment inputs
        if (leaveningType === 'sourdough-starter' || leaveningType === 'poolish') {
            prefermentInputs.style.display = 'block';
            // Set defaults
            if (leaveningType === 'sourdough-starter') {
                document.getElementById('inoculatedFlourPercent').value = 20;
                document.getElementById('prefermentHydration').value = 100;
            } else if (leaveningType === 'poolish') {
                document.getElementById('inoculatedFlourPercent').value = 30;
                document.getElementById('prefermentHydration').value = 100;
            }
        } else {
            prefermentInputs.style.display = 'none';
        }
        
        this.updateRecipe();
    }

    collectRecipeData() {
        const mandatory = {
            doughPortions: parseInt(document.getElementById('doughPortions').value) || 1,
            portionWeight: parseInt(document.getElementById('portionWeight').value) || 500,
            hydrationPercent: parseFloat(document.getElementById('hydrationPercent').value) || 72,
            saltPercent: parseFloat(document.getElementById('saltPercent').value) || 2.2,
            leaveningType: document.getElementById('leaveningType').value,
            yeastPercent: parseFloat(document.getElementById('yeastPercent').value) || 0.210
        };

        // Add preferment data if applicable
        const prefermentInputs = document.getElementById('prefermentInputs');
        if (prefermentInputs && prefermentInputs.style.display !== 'none') {
            mandatory.inoculatedFlourPercent = parseFloat(document.getElementById('inoculatedFlourPercent').value) || 0;
            mandatory.prefermentHydration = parseFloat(document.getElementById('prefermentHydration').value) || 100;
        }

        return {
            recipeName: this.recipeName,
            mandatory,
            addons: this.addonSystem.getAddonData()
        };
    }

    performCalculations(data) {
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

        return {
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
    }

    updateRecipeDisplay(calculatedData) {
        const { ingredients, stats } = calculatedData;
        const display = document.getElementById('recipeDisplay');
        
        let html = `
            <div class="ingredient-list">
                <h3>🍞 Main Dough Ingredients</h3>
                <div class="ingredient">
                    <span class="ingredient-name">Bread Flour</span>
                    <span class="ingredient-amount">${ingredients.flour}g</span>
                </div>
        `;

        if (ingredients.wholeWheatFlour > 0) {
            html += `
                <div class="ingredient">
                    <span class="ingredient-name">Whole Wheat Flour</span>
                    <span class="ingredient-amount">${ingredients.wholeWheatFlour}g</span>
                </div>
            `;
        }

        html += `
                <div class="ingredient">
                    <span class="ingredient-name">Water</span>
                    <span class="ingredient-amount">${ingredients.water}g</span>
                </div>
                <div class="ingredient">
                    <span class="ingredient-name">Salt</span>
                    <span class="ingredient-amount">${ingredients.salt}g</span>
                </div>
                <div class="ingredient">
                    <span class="ingredient-name">Yeast</span>
                    <span class="ingredient-amount">${ingredients.yeast}g</span>
                </div>
        `;

        // Add TangZhong if present
        if (ingredients.tangzhong.flour > 0) {
            html += `
                </div>
                <div class="ingredient-list">
                    <h3>🌾 TangZhong</h3>
                    <div class="ingredient">
                        <span class="ingredient-name">Flour</span>
                        <span class="ingredient-amount">${ingredients.tangzhong.flour}g</span>
                    </div>
                    <div class="ingredient">
                        <span class="ingredient-name">Water</span>
                        <span class="ingredient-amount">${ingredients.tangzhong.water}g</span>
                    </div>
            `;
        }

        // Add other addons
        const otherAddons = Object.entries(ingredients.addons);
        if (otherAddons.length > 0) {
            html += `
                </div>
                <div class="ingredient-list">
                    <h3>✨ Additional Ingredients</h3>
            `;
            otherAddons.forEach(([key, addon]) => {
                if (addon.amount > 0) {
                    const name = key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    html += `
                        <div class="ingredient">
                            <span class="ingredient-name">${name}</span>
                            <span class="ingredient-amount">${addon.amount}g</span>
                        </div>
                    `;
                }
            });
        }

        html += `
            </div>
            <div class="recipe-stats">
                <div class="recipe-stat">
                    <div class="stat-value">${stats.totalFlour}g</div>
                    <div class="stat-label">Total Flour</div>
                </div>
                <div class="recipe-stat">
                    <div class="stat-value">${stats.totalWeight}g</div>
                    <div class="stat-label">Total Weight</div>
                </div>
                <div class="recipe-stat">
                    <div class="stat-value">${stats.actualHydration}%</div>
                    <div class="stat-label">Actual Hydration</div>
                </div>
            </div>
        `;

        display.innerHTML = html;
    }

    updateRecipe() {
        this.currentRecipeData = this.collectRecipeData();
        const calculatedData = this.performCalculations(this.currentRecipeData);
        this.updateRecipeDisplay(calculatedData);
        this.updateDebugJson();
    }

    updateDebugJson() {
        const textarea = document.getElementById('recipeJson');
        if (textarea) {
            textarea.value = JSON.stringify(this.currentRecipeData, null, 2);
        }
    }

    shareRecipe() {
        // Simple URL sharing (can be enhanced with compression later)
        const data = encodeURIComponent(JSON.stringify(this.currentRecipeData));
        const url = `${window.location.origin}${window.location.pathname}?recipe=${data}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('Recipe URL copied to clipboard!');
            });
        } else {
            prompt('Copy this URL to share your recipe:', url);
        }
    }

    copyRecipeJson() {
        const textarea = document.getElementById('recipeJson');
        if (textarea) {
            textarea.select();
            document.execCommand('copy');
            alert('Recipe JSON copied to clipboard!');
        }
    }
}