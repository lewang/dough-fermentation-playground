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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        margin: '0.25rem auto',
        cursor: 'grab',
        maxWidth: '80%'
      }}
    >
      <span 
        style={{ 
          color: 'var(--text-tertiary)', 
          cursor: 'grab',
          fontSize: '0.9rem'
        }}
        title="Drag to reorder"
      >
        ≡
      </span>
      
      <div style={{ flex: '1 1 auto', fontSize: '0.9rem', display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <EditableText
          value={ingredient.name}
          onChange={handleNameChange}
          className="ingredient-name"
        />
      </div>
      
      <input
        type="number"
        min="0"
        step="0.1"
        value={ingredient.value || ingredient.defaultValue || ''}
        onChange={handleValueChange}
        style={{
          width: '80px',
          padding: '0.5rem',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          background: 'var(--surface-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          flexShrink: 0
        }}
      />
      
      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', flexShrink: 0, minWidth: '20px' }}>
        {ingredient.unit}
      </span>
      
      <button
        onClick={() => onRemove(index)}
        className="remove-btn"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: 'none',
          borderRadius: '4px',
          width: '24px',
          height: '24px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        title="Remove ingredient"
      >
        ×
      </button>
    </div>
  );
}
