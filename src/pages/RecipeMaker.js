export class RecipeMaker {
    constructor() {
        this.recipeName = 'New Recipe';
    }

    render() {
        return `
            <div id="recipe-maker" class="tab-content active">
                <div class="content-container">
                    <div class="recipe-header">
                        <h1 class="recipe-name">${this.recipeName}</h1>
                        <span class="edit-icon" onclick="editRecipeName()" title="Edit recipe name">✏️</span>
                    </div>
                    
                    <!-- Section 1: Mandatory Inputs -->
                    <section class="recipe-section mandatory">
                        <h2>🍞 Main Dough</h2>
                        <div class="recipe-inputs">
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="doughPortions">Dough Portions</label>
                                    <input type="number" id="doughPortions" value="1" min="1" onchange="updateRecipe()">
                                </div>
                                <div class="input-group main-input">
                                    <label for="portionWeight">Portion Weight</label>
                                    <input type="number" id="portionWeight" value="500" min="1" onchange="updateRecipe()">
                                    <span class="unit">g</span>
                                </div>
                            </div>
                            
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="hydrationPercent">Hydration</label>
                                    <input type="number" id="hydrationPercent" value="72" min="1" max="200" step="0.1" onchange="updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                                <div class="input-group main-input">
                                    <label for="saltPercent">Salt</label>
                                    <input type="number" id="saltPercent" value="2.2" min="0" max="10" step="0.1" onchange="updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                            </div>
                            
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="leaveningType">Leavening</label>
                                    <select id="leaveningType" onchange="updateLeaveningInputs()">
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
                                    <input type="number" id="yeastPercent" value="0.210" step="0.001" min="0" onchange="updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <!-- Recipe Output -->
                    <section class="recipe-output">
                        <h2>📋 Recipe</h2>
                        <div id="recipeDisplay" class="recipe-display">
                            <!-- Calculated ingredients will appear here -->
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Recipe name editing
        window.editRecipeName = () => {
            const recipeName = document.querySelector('.recipe-name');
            const currentName = recipeName.textContent;
            const newName = prompt('Enter recipe name:', currentName);
            if (newName && newName.trim()) {
                this.recipeName = newName.trim();
                recipeName.textContent = this.recipeName;
            }
        };

        // Recipe calculation placeholder
        window.updateRecipe = () => {
            console.log('Recipe updated');
            // Recipe calculation logic would go here
        };

        window.updateLeaveningInputs = () => {
            console.log('Leavening inputs updated');
            // Leavening input logic would go here
        };
    }
}