import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Section } from '../ui/Section.jsx';
import { RecipeStep } from './RecipeStep.jsx';
import { stepTemplates } from '../../data/stepTemplates.js';
import { createDragHandlers } from '../../utils/dragDrop.js';

export function StepsSection({ steps, onStepsChange }) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef();


  const filteredTemplates = stepTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const addStep = (template) => {
    const newStep = {
      id: Date.now(),
      name: template.name,
      duration: template.defaultDuration,
      groupId: '',
      ...(template.temperature !== undefined && { temperature: template.temperature }),
      ...(template.reps !== undefined && { reps: template.reps }),
      ...(template.ingredients && { 
        ingredients: template.ingredients.map(ing => ({
          ...ing,
          value: ing.defaultValue
        }))
      })
    };
    
    onStepsChange([...steps, newStep]);
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setShowSearchInput(false);
  };

  const showAddStepInput = () => {
    setShowSearchInput(true);
    setShowSuggestions(true);
    
    // Focus the input after it's rendered
    setTimeout(() => {
      searchRef.current?.querySelector('input')?.focus();
    }, 0);
  };

  const updateStep = (index, updatedStep) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    onStepsChange(newSteps);
  };

  const removeStep = (index) => {
    onStepsChange(steps.filter((_, i) => i !== index));
  };

  const setSteps = (newSteps) => {
    onStepsChange(newSteps);
  };

  const stepDragHandlers = createDragHandlers(steps, setSteps);

  const handleSearchKeyDown = (e) => {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, filteredTemplates.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredTemplates[selectedIndex]) {
          addStep(filteredTemplates[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setShowSearchInput(false);
        setSearchQuery('');
        searchRef.current?.querySelector('input')?.blur();
        break;
    }
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  // Hide input when it loses focus
  const handleSearchBlur = () => {
    setShowSuggestions(false);
    setShowSearchInput(false);
    setSearchQuery('');
  };

  return (
    <section className="recipe-section steps-section">
      {/* Custom header with + button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '0.5rem'
      }}>
        <h2 style={{ 
          margin: 0,
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600',
          borderBottom: 'none'
        }}>
          ⏰ Steps
        </h2>
        <button
          onClick={showAddStepInput}
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Add step"
        >
          +
        </button>
      </div>

      {/* Add step search interface - only show when needed */}
      {showSearchInput && (
        <div style={{ marginBottom: '1.5rem' }} ref={searchRef}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search step templates..."
              value={searchQuery}
              onChange={handleSearchChange}
              onInput={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={handleSearchKeyDown}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
            
            {showSuggestions && filteredTemplates.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 4px 6px var(--shadow-color)'
              }}>
                {filteredTemplates.map((template, index) => (
                  <div
                    key={template.name}
                    onClick={() => addStep(template)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)',
                      background: index === selectedIndex ? 'var(--surface-secondary)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div style={{ fontWeight: '500' }}>{template.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {template.defaultDuration}
                      {template.temperature && ` • ${template.temperature}°C`}
                      {template.reps && ` • ${template.reps} reps`}
                      {template.ingredients && ` • ${template.ingredients.length} ingredients`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="recipe-inputs">
        {/* Steps list */}
        {steps.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-tertiary)',
            fontStyle: 'italic'
          }}>
            No steps added yet. Click the + button above to get started.
          </div>
        ) : (
          steps.map((step, index) => (
            <RecipeStep
              key={step.id || index}
              step={step}
              index={index}
              onUpdate={updateStep}
              onRemove={removeStep}
              stepDragHandlers={stepDragHandlers}
            />
          ))
        )}
      </div>
    </section>
  );
}