import { h } from 'preact';
import { useState } from 'preact/hooks';

export function EditableText({ 
  value, 
  onChange, 
  className = '', 
  placeholder = '',
  isTitle = false 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const startEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const finishEdit = (save = true) => {
    if (save && editValue.trim() && editValue.trim() !== value) {
      onChange?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit(true);
    }
    if (e.key === 'Escape') {
      finishEdit(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => finishEdit(true)}
        onKeyDown={handleKeyDown}
        className={`editable-input ${className}`}
        placeholder={placeholder}
        autoFocus
        style={{
          background: 'transparent',
          border: '2px solid var(--color-primary)',
          color: 'inherit',
          font: 'inherit',
          padding: '0.25rem',
          borderRadius: '4px',
          width: isTitle ? '100%' : 'auto',
          minWidth: '120px'
        }}
      />
    );
  }

  return (
    <span className={`editable-text ${className}`}>
      {value}
      <span 
        className="edit-icon" 
        onClick={startEdit}
        title="Edit"
        style={{ 
          marginLeft: '0.5rem',
          cursor: 'pointer',
          color: 'var(--text-tertiary)',
          fontSize: '0.9rem'
        }}
      >
        ✏️
      </span>
    </span>
  );
}