import { h } from 'preact';

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
        gap: '0.5rem',
        padding: '0.5rem',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        margin: '0.25rem 0',
        cursor: 'grab'
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
      
      <span style={{ flex: 1, fontSize: '0.9rem' }}>
        {ingredient.name}:
      </span>
      
      <input
        type="number"
        min="0"
        step="0.1"
        value={ingredient.value || ingredient.defaultValue || ''}
        onChange={handleValueChange}
        style={{
          width: '80px',
          padding: '0.25rem',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          background: 'var(--surface-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem'
        }}
      />
      
      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
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
          width: '20px',
          height: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Remove ingredient"
      >
        ×
      </button>
    </div>
  );
}