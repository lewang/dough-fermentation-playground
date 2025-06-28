import { h } from 'preact';
import { EditableText } from '../ui/EditableText.jsx';

export function StepIngredient({ 
  ingredient, 
  index, 
  onUpdate, 
  onRemove,
  dragHandlers 
}) {
  const handleValueChange = (e) => {
    const newValue = parseFloat(e.target.value) || 0;
    onUpdate(index, { ...ingredient, value: newValue });
  };

  const handleNameChange = (newName) => {
    onUpdate(index, { ...ingredient, name: newName });
  };

  return (
    <div 
      className="step-ingredient"
      draggable
      onDragStart={dragHandlers.handleDragStart(index)}
      onDragEnd={dragHandlers.handleDragEnd}
      onDragOver={dragHandlers.handleDragOver}
      onDrop={dragHandlers.handleDrop(index)}
    >
      <span 
        className="step-ingredient-drag-handle"
        title="Drag to reorder"
      >
        ≡
      </span>
      
      <div className="step-ingredient-name-container">
        <EditableText
          value={ingredient.name}
          onChange={handleNameChange}
          className="ingredient-name"
        />
      </div>
      
      <div className="step-ingredient-value-container">
        <input
          type="number"
          min="0"
          step="0.1"
          value={ingredient.value || ingredient.defaultValue || ''}
          onChange={handleValueChange}
          className="step-ingredient-value-input"
        />
      </div>
      
      <div className="ingredient-unit-container">
        <span className="unit-label">{ingredient.unit}</span>
        {ingredient.scaling && ingredient.scaling < 1 && (ingredient.value != null || ingredient.defaultValue != null) && 
         Math.round((ingredient.value ?? ingredient.defaultValue ?? 0) * ingredient.scaling) > 0 && (
          <div className="water-scaling">
            <span>
              ({Math.round((ingredient.value ?? ingredient.defaultValue ?? 0) * ingredient.scaling)}g water)
            </span>
          </div>
        )}
      </div>
      
      <div className="step-ingredient-remove-container">
        <button
          onClick={() => onRemove(index)}
          className="step-ingredient-remove-btn"
          title="Remove ingredient"
        >
          ×
        </button>
      </div>
    </div>
  );
}
