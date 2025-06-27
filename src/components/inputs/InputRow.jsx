import { h } from 'preact';

export function InputRow({ children, className = '' }) {
  return (
    <div className={`input-row ${className}`}>
      {children}
    </div>
  );
}