import { h } from 'preact';
import { useState } from 'preact/hooks';

export function RecipeHeader({ recipeName, onNameChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(recipeName);

  const startEdit = () => {
    setEditValue(recipeName);
    setIsEditing(true);
  };

  const finishEdit = (save = true) => {
    if (save && editValue.trim()) {
      onNameChange?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') finishEdit(true);
    if (e.key === 'Escape') finishEdit(false);
  };

  return (
    <div className="recipe-header">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => finishEdit(true)}
          onKeyDown={handleKeyDown}
          className="recipe-name-edit"
          style={{
            background: 'transparent',
            border: '2px solid var(--color-primary)',
            color: 'inherit',
            font: 'inherit',
            padding: '0.25rem',
            borderRadius: '4px',
            width: '100%'
          }}
          autoFocus
        />
      ) : (
        <>
          <h1 className="recipe-name">{recipeName}</h1>
          <span 
            className="edit-icon" 
            onClick={startEdit}
            title="Edit recipe name"
          >
            ✏️
          </span>
        </>
      )}
    </div>
  );
}