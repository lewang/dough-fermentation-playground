import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Section } from '../ui/Section.jsx';
import { RecipeStep } from './RecipeStep.jsx';
import { stepTemplates } from '../../data/stepTemplates.js';
import { createDragHandlers } from '../../utils/dragDrop.js';

export function StepsSection({ steps, onStepsChange }) {
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
        searchRef.current?.blur();
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Section title="⏰ Steps" className="steps-section">
      {/* Add step interface */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }} ref={searchRef}>
            <input
              type="text"
              placeholder="Search step templates..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
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
          
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              fontSize: '20px',
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
      </div>

      {/* Steps list */}
      {steps.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic'
        }}>
          No steps added yet. Search for a step template above to get started.
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
    </Section>
  );
}