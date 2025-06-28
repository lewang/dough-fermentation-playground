import { h } from 'preact';
import { EditableText } from '../ui/EditableText.jsx';
import { DurationInput } from './DurationInput.jsx';
import { StepIngredient } from './StepIngredient.jsx';
import { createDragHandlers } from '../../utils/dragDrop.js';
import { parseStepName } from '../../utils/stepUtils.js';

export function RecipeStep({ 
  step, 
  index, 
  onUpdate, 
  onRemove,
  stepDragHandlers 
}) {
  const updateStep = (field, value) => {
    onUpdate(index, { ...step, [field]: value });
  };

  const updateIngredient = (ingredientIndex, newIngredient) => {
    const newIngredients = [...(step.ingredients || [])];
    newIngredients[ingredientIndex] = newIngredient;
    updateStep('ingredients', newIngredients);
  };

  const removeIngredient = (ingredientIndex) => {
    const newIngredients = step.ingredients.filter((_, i) => i !== ingredientIndex);
    updateStep('ingredients', newIngredients);
  };

  const addIngredient = () => {
    const newIngredient = {
      name: 'new ingredient',
      type: 'generic',
      unit: 'g',
      defaultValue: 0,
      value: 0
    };
    updateStep('ingredients', [...(step.ingredients || []), newIngredient]);
  };

  const setIngredients = (newIngredients) => {
    updateStep('ingredients', newIngredients);
  };

  const ingredientDragHandlers = createDragHandlers(step.ingredients || [], setIngredients);

  // Parse group ID and title from step name
  const { groupId, title } = parseStepName(step.name);

  return (
    <div 
      className="recipe-step"
      draggable
      onDragStart={stepDragHandlers.handleDragStart(index)}
      onDragEnd={stepDragHandlers.handleDragEnd}
      onDragOver={stepDragHandlers.handleDragOver}
      onDrop={stepDragHandlers.handleDrop(index)}
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        position: 'relative'
      }}
    >
      {/* Drag handle and step header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <span 
          style={{ 
            color: 'var(--text-tertiary)', 
            cursor: 'grab',
            marginRight: '0.5rem',
            fontSize: '1.1rem'
          }}
          title="Drag to reorder step"
        >
          ≡
        </span>
        
        <span style={{ 
          fontWeight: 'bold', 
          marginRight: '0.5rem',
          color: 'var(--text-secondary)'
        }}>
          {index + 1}.
          {groupId && (
            <span style={{ 
              color: 'var(--color-primary)', 
              fontSize: '0.8rem',
              marginLeft: '0.25rem'
            }}>
              [{groupId}]
            </span>
          )}
        </span>
        
        <div style={{ flex: 1 }}>
          <EditableText
            value={step.name}
            onChange={(value) => updateStep('name', value)}
            isTitle={true}
            className="step-title"
            placeholder="Enter step name (use 'groupId. title' format for grouping)"
          />
        </div>
        
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
            justifyContent: 'center'
          }}
          title="Remove step"
        >
          ×
        </button>
      </div>

      {/* Step details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>
            Duration:
          </label>
          <DurationInput
            value={step.duration}
            onChange={(value) => updateStep('duration', value)}
          />
        </div>


        {step.temperature !== undefined && (
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>
              Temperature:
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                value={step.temperature}
                onChange={(e) => updateStep('temperature', parseFloat(e.target.value) || 0)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  background: 'var(--surface-color)',
                  color: 'var(--text-primary)',
                  width: '80px'
                }}
              />
              <span style={{ marginLeft: '0.25rem', fontSize: '0.9rem' }}>°C</span>
            </div>
          </div>
        )}

        {step.reps !== undefined && (
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: '500', display: 'block', marginBottom: '0.25rem' }}>
              Repetitions:
            </label>
            <input
              type="number"
              min="1"
              value={step.reps}
              onChange={(e) => updateStep('reps', parseInt(e.target.value) || 1)}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                width: '80px'
              }}
            />
          </div>
        )}
      </div>

      {/* Ingredients section */}
      {step.ingredients && step.ingredients.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              Ingredients:
            </label>
            <button
              onClick={addIngredient}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                width: '20px',
                height: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Add ingredient"
            >
              +
            </button>
          </div>
          
          {step.ingredients.map((ingredient, i) => (
            <StepIngredient
              key={i}
              ingredient={ingredient}
              index={i}
              onUpdate={updateIngredient}
              onRemove={removeIngredient}
              dragHandlers={ingredientDragHandlers}
            />
          ))}
        </div>
      )}

      {/* Add ingredients button for steps without ingredients */}
      {(!step.ingredients || step.ingredients.length === 0) && (
        <div style={{ marginTop: '0.5rem' }}>
          <button
            onClick={addIngredient}
            style={{
              background: 'var(--surface-secondary)',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border-color)',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              width: '100%'
            }}
          >
            + Add ingredients
          </button>
        </div>
      )}
    </div>
  );
}