// Recipe calculation engine
export const recipeCalculations = {
    // Yeast scaling ratios relative to active dry yeast
    yeastScaling: {
        'active-dry-yeast': 1.0,
        'instant-yeast': 0.75,
        'cake-yeast': 3.0,
        'sourdough-starter': 20.0,
        'poolish': 0.15
    },

    calculateFlour: function(portions, portionWeight, hydrationPercent, wholeWheatFlour = 0) {
        const totalWeight = portions * portionWeight;
        const flourWeight = totalWeight / (1 + hydrationPercent / 100);
        return Math.max(0, flourWeight - wholeWheatFlour);
    },

    calculateWater: function(totalFlour, hydrationPercent) {
        return totalFlour * (hydrationPercent / 100);
    },

    calculateSalt: function(totalFlour, saltPercent) {
        return totalFlour * (saltPercent / 100);
    },

    calculateYeast: function(totalFlour, yeastPercent, yeastType) {
        const baseYeast = totalFlour * (yeastPercent / 100);
        const scaling = this.yeastScaling[yeastType] || 1.0;
        return baseYeast * scaling;
    },


    calculatePreferment: function(totalFlour, inoculatedPercent, prefermentHydration) {
        if (!inoculatedPercent || inoculatedPercent <= 0) return { flour: 0, water: 0 };
        const flourInPreferment = totalFlour * (inoculatedPercent / 100);
        const waterInPreferment = flourInPreferment * (prefermentHydration / 100);
        return {
            flour: flourInPreferment,
            water: waterInPreferment
        };
    }
};