# Recipe Maker v2 Styling Improvements

## Overview
Refinements to the Recipe Maker styling and UX based on user feedback to improve dark mode compatibility and modernize the input design.

## Issues to Fix

### 1. Dark Mode Input Compatibility
**Problem**: Number input spinner buttons and dropdowns are not dark mode friendly
- Number input up/down click buttons use browser default styling
- Whole Wheat Flour dropdown (g/%) has poor contrast in dark mode
- Need consistent dark mode theming across all input elements

**Solution**:
```css
/* Hide default number input spinners and create custom ones */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

/* Custom number input styling with dark mode support */
.input-group input[type="number"] {
    background: var(--surface-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

/* Custom select styling for consistent dark mode */
.input-group select {
    background: var(--surface-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
    appearance: none;
}
```

### 2. TangZhong Section Restructure
**Problem**: TangZhong has its own section when it should be treated as an addon
- Currently creates a separate "TangZhong" section
- Should be integrated into the Add-ons section like other ingredients
- Simplifies the overall structure

**Solution**:
```javascript
// Update availableAddons array - TangZhong should point to 'addons' section
{ id: 'tangzhong', name: 'TangZhong', section: 'addons' }

// Update createAddonInputs function to handle TangZhong like other addons
case 'tangzhong':
    addonItem.innerHTML = `
        <label>TangZhong:</label>
        <div style="display: flex; gap: 0.5rem; flex: 1;">
            <div style="flex: 1;">
                <label style="font-size: 0.8rem;">Flour (g):</label>
                <input type="number" min="0" step="0.1" onchange="updateRecipe()">
            </div>
            <div style="flex: 1;">
                <label style="font-size: 0.8rem;">Hydration (%):</label>
                <input type="number" min="0" step="0.1" value="200" onchange="updateRecipe()">
            </div>
        </div>
        <button class="remove-btn" onclick="removeAddon('${addon.id}')">Remove</button>
    `;
    break;

// Remove tangzhong-specific section logic
// Update data collection to get TangZhong from addons instead of separate section
```

### 3. Modern Input Styling Overhaul
**Problem**: Inputs are too wide and don't look modern
- Current inputs lack modern styling conventions
- Width management is inconsistent
- Missing focus states and transitions
- Need better visual hierarchy

**Solution**:
```css
/* Modern input group styling */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
}

.input-group label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

/* Modern input styling */
.input-group input,
.input-group select {
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--border-color);
    border-radius: 8px;
    background: var(--surface-color);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
    box-sizing: border-box;
    max-width: 100%;
}

/* Better focus states */
.input-group input:focus,
.input-group select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    transform: translateY(-1px);
}

/* Responsive width management */
.input-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    align-items: end;
}

/* Specific input widths */
.input-group input[type="number"] {
    max-width: 120px;
}

.input-group select {
    max-width: 180px;
}

.input-group.full-width input,
.input-group.full-width select {
    max-width: 100%;
}

/* Unit labels positioning */
.input-group .unit {
    position: absolute;
    right: 1rem;
    top: 2.25rem;
    color: var(--text-tertiary);
    font-size: 0.75rem;
    pointer-events: none;
    font-weight: 500;
}

.input-group input[type="number"] {
    padding-right: 2.5rem;
}
```

### 4. Addon Item Styling Improvements
**Problem**: Addon items need better responsive design and consistency

**Solution**:
```css
/* Modern addon item styling */
.addon-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
}

.addon-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Addon header with remove button */
.addon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.addon-header label {
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

/* Modern remove button */
.remove-btn {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

/* Addon input rows */
.addon-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    align-items: end;
}
```

## Implementation Plan

### Phase 1: Dark Mode Input Fixes
1. **Update number input styling** - Remove spinners, add custom dark mode support
2. **Fix dropdown styling** - Custom select styling with dark mode arrows
3. **Test all input types** - Ensure consistent appearance across themes

### Phase 2: TangZhong Integration  
1. **Update addon configuration** - Move TangZhong to addons section
2. **Modify createAddonInputs()** - Add TangZhong case with dual inputs
3. **Update data collection** - Remove tangzhong section logic
4. **Remove tangzhong section** - Clean up HTML and show/hide logic

### Phase 3: Modern Input Design
1. **Implement new input styling** - Modern borders, focus states, transitions
2. **Responsive width management** - Better grid layouts and max-widths
3. **Update addon item layout** - Improved card design with better spacing
4. **Enhance visual hierarchy** - Better typography and color usage

### Phase 4: Testing & Polish
1. **Cross-browser testing** - Ensure compatibility across browsers
2. **Mobile responsive testing** - Verify layouts work on all screen sizes
3. **Dark/light mode testing** - Confirm styling works in both themes
4. **Accessibility review** - Check focus indicators and contrast ratios

## Expected Outcomes

### Visual Improvements
- **Consistent dark mode** styling across all inputs
- **Modern, professional** appearance with proper spacing
- **Better responsive design** that works on all screen sizes
- **Cleaner component organization** with TangZhong as an addon

### User Experience
- **Improved focus states** with smooth transitions
- **Better visual hierarchy** making the form easier to scan
- **Consistent interaction patterns** across all input types
- **Simplified mental model** with unified addon system

### Technical Benefits
- **Reduced CSS complexity** by consolidating input styles
- **Better maintainability** with consistent styling patterns
- **Improved accessibility** with proper focus indicators
- **Cross-browser consistency** with custom input styling

This styling overhaul will modernize the Recipe Maker interface while maintaining all existing functionality and improving the overall user experience across different themes and devices.