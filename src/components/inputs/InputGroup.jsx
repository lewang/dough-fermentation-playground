import { h } from 'preact';

export function InputGroup({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  unit, 
  className = '', 
  min, 
  max, 
  step, 
  placeholder,
  options,
  ...props 
}) {
  const isSelect = type === 'select';
  
  return (
    <div className={`input-group ${className}`}>
      <label>{label}</label>
      {isSelect ? (
        <select value={value} onChange={(e) => onChange?.(e.target.value)} {...props}>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          {...props}
        />
      )}
      {unit && <span className="unit">{unit}</span>}
    </div>
  );
}