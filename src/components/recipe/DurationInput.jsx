import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { parseDuration } from '../../utils/durationParser.js';

export function DurationInput({ value, onChange, className = '' }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [parseResult, setParseResult] = useState({ isValid: true, minutes: 0, display: '' });

  useEffect(() => {
    const result = parseDuration(inputValue);
    setParseResult(result);
    if (result.isValid) {
      onChange?.(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const getValidationIcon = () => {
    if (!inputValue.trim()) return null;
    return parseResult.isValid ? (
      <span style={{ color: 'var(--color-success)', marginLeft: '0.5rem' }}>✓</span>
    ) : (
      <span style={{ color: 'var(--color-error)', marginLeft: '0.5rem' }}>✗</span>
    );
  };

  return (
    <div className={`duration-input ${className}`} style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="e.g., 30 minutes, 2h, 1:30"
        style={{
          padding: '0.5rem',
          border: `1px solid ${parseResult.isValid || !inputValue.trim() ? 'var(--border-color)' : 'var(--color-error)'}`,
          borderRadius: '4px',
          background: 'var(--surface-color)',
          color: 'var(--text-primary)',
          width: '150px'
        }}
      />
      {getValidationIcon()}
      {parseResult.isValid && parseResult.display && inputValue.trim() && (
        <small style={{ 
          marginLeft: '0.5rem', 
          color: 'var(--text-tertiary)',
          fontSize: '0.8rem'
        }}>
          ({parseResult.display})
        </small>
      )}
    </div>
  );
}