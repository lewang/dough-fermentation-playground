// Addon system for Recipe Maker
export const availableAddons = [
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

export class AddonSystem {
    constructor(updateRecipeCallback) {
        this.activeAddons = new Set();
        this.selectedSuggestionIndex = -1;
        this.updateRecipe = updateRecipeCallback;
    }

    showAddonSuggestions(query) {
        const suggestions = document.getElementById('addonSuggestions');
        if (!suggestions) return;

        if (!query || query.trim() === '') {
            // Show all suggestions when empty or clicked
            this.renderSuggestions(availableAddons);
            suggestions.classList.add('show');
            return;
        }

        const filteredAddons = availableAddons.filter(addon => 
            addon.name.toLowerCase().includes(query.toLowerCase()) &&
            !this.activeAddons.has(addon.id)
        );

        this.renderSuggestions(filteredAddons);
        suggestions.classList.toggle('show', filteredAddons.length > 0);
        this.selectedSuggestionIndex = -1;
    }

    renderSuggestions(addons) {
        const suggestions = document.getElementById('addonSuggestions');
        if (!suggestions) return;

        suggestions.innerHTML = addons.map((addon, index) => 
            `<div class="suggestion-item ${index === this.selectedSuggestionIndex ? 'selected' : ''}" 
                  onclick="window.addonSystem.addIngredient('${addon.id}')" 
                  data-addon="${addon.id}" data-index="${index}">
                ${addon.name}
            </div>`
        ).join('');
    }

    handleAddonKeydown(event) {
        const suggestions = document.getElementById('addonSuggestions');
        const items = suggestions.querySelectorAll('.suggestion-item');
        
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, items.length - 1);
                this.updateSelectedSuggestion();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
                this.updateSelectedSuggestion();
                break;
            case 'Enter':
                event.preventDefault();
                if (this.selectedSuggestionIndex >= 0 && items[this.selectedSuggestionIndex]) {
                    const addonId = items[this.selectedSuggestionIndex].dataset.addon;
                    this.addIngredient(addonId);
                }
                break;
            case 'Escape':
                suggestions.classList.remove('show');
                document.getElementById('addonSearch').blur();
                break;
        }
    }

    updateSelectedSuggestion() {
        const items = document.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedSuggestionIndex);
        });
    }

    addIngredient(addonId) {
        if (this.activeAddons.has(addonId)) return;

        const addon = availableAddons.find(a => a.id === addonId);
        if (!addon) return;

        this.activeAddons.add(addonId);
        
        // Clear search and hide suggestions
        document.getElementById('addonSearch').value = '';
        document.getElementById('addonSuggestions').classList.remove('show');

        // Create addon UI
        this.createAddonUI(addon);
        
        // Show appropriate section
        this.showSection(addon.section);
        
        // Update recipe
        this.updateRecipe();
    }

    createAddonUI(addon) {
        const sectionId = addon.section === 'addons' ? 'addonsList' : 'processesList';
        const container = document.getElementById(sectionId);
        if (!container) return;

        const addonHtml = this.createAddonInputs(addon);
        container.insertAdjacentHTML('beforeend', addonHtml);
    }

    createAddonInputs(addon) {
        switch(addon.id) {
            case 'tangzhong':
                return `
                    <div class="addon-item" data-addon-id="${addon.id}">
                        <label class="addon-label">${addon.name}</label>
                        <div class="addon-inputs">
                            <div class="input-group">
                                <input type="number" data-field="flour" min="0" step="0.1" onchange="window.addonSystem.updateRecipe()">
                                <span class="unit">Flour (g)</span>
                            </div>
                            <div class="input-group">
                                <input type="number" data-field="hydration" min="0" step="0.1" value="200" onchange="window.addonSystem.updateRecipe()">
                                <span class="unit">Hydration (% of tangzhong flour)</span>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="window.addonSystem.removeAddon('${addon.id}')" title="Remove">×</button>
                    </div>
                `;

            case 'whole-wheat-flour':
                return `
                    <div class="addon-item" data-addon-id="${addon.id}">
                        <label class="addon-label">${addon.name}</label>
                        <div class="addon-inputs">
                            <div class="input-group">
                                <input type="number" data-field="amount" min="0" step="0.1" onchange="window.addonSystem.updateRecipe()">
                                <select data-field="unit" onchange="window.addonSystem.updateRecipe()">
                                    <option value="percent">% of all flour</option>
                                    <option value="grams">g</option>
                                </select>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="window.addonSystem.removeAddon('${addon.id}')" title="Remove">×</button>
                    </div>
                `;

            case 'oil':
            case 'milk':
            case 'sugar':
            case 'butter':
            case 'eggs':
            case 'baking-powder':
                return `
                    <div class="addon-item" data-addon-id="${addon.id}">
                        <label class="addon-label">${addon.name}</label>
                        <div class="addon-inputs">
                            <div class="input-group">
                                <input type="number" min="0" step="0.1" onchange="window.addonSystem.updateRecipe()">
                                <span class="unit">g</span>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="window.addonSystem.removeAddon('${addon.id}')" title="Remove">×</button>
                    </div>
                `;

            case 'cold-fermentation':
            case 'room-temp-fermentation':
                return `
                    <div class="addon-item" data-addon-id="${addon.id}">
                        <label class="addon-label">${addon.name}</label>
                        <div class="addon-inputs">
                            <div class="input-group">
                                <input type="text" value="12 hours" onchange="window.addonSystem.updateRecipe()">
                            </div>
                        </div>
                        <button class="remove-btn" onclick="window.addonSystem.removeAddon('${addon.id}')" title="Remove">×</button>
                    </div>
                `;

            default:
                return `
                    <div class="addon-item" data-addon-id="${addon.id}">
                        <label class="addon-label">${addon.name}</label>
                        <div class="addon-inputs">
                            <div class="input-group">
                                <input type="number" min="0" step="0.1" onchange="window.addonSystem.updateRecipe()">
                                <span class="unit">g</span>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="window.addonSystem.removeAddon('${addon.id}')" title="Remove">×</button>
                    </div>
                `;
        }
    }

    removeAddon(addonId) {
        this.activeAddons.delete(addonId);
        const addonElement = document.querySelector(`[data-addon-id="${addonId}"]`);
        if (addonElement) {
            addonElement.remove();
        }

        // Hide sections if empty
        this.updateSectionVisibility();
        this.updateRecipe();
    }

    showSection(sectionName) {
        const sectionElement = document.getElementById(`${sectionName}Section`);
        if (sectionElement) {
            sectionElement.style.display = 'block';
        }
    }

    updateSectionVisibility() {
        const addonsSection = document.getElementById('addonsSection');
        const processesSection = document.getElementById('processesSection');
        
        if (addonsSection) {
            const hasAddons = document.getElementById('addonsList')?.children.length > 0;
            addonsSection.style.display = hasAddons ? 'block' : 'none';
        }
        
        if (processesSection) {
            const hasProcesses = document.getElementById('processesList')?.children.length > 0;
            processesSection.style.display = hasProcesses ? 'block' : 'none';
        }
    }

    getAddonData() {
        const addonData = {};
        
        document.querySelectorAll('.addon-item').forEach(item => {
            const addonId = item.dataset.addonId;
            const inputs = item.querySelectorAll('input, select');
            const data = {};
            
            inputs.forEach(input => {
                const field = input.dataset.field;
                if (field) {
                    data[field] = input.type === 'number' ? 
                        parseFloat(input.value) || 0 : 
                        input.value;
                } else if (input.type === 'number') {
                    // For simple addons without data-field, use 'amount'
                    data.amount = parseFloat(input.value) || 0;
                } else {
                    // For text inputs like duration
                    data.duration = input.value;
                }
            });
            
            addonData[addonId] = data;
        });
        
        return addonData;
    }
}
