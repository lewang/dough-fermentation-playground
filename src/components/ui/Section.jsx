import { h } from 'preact';

export function Section({ 
  title, 
  children, 
  className = '', 
  id,
  hidden = false 
}) {
  return (
    <section 
      className={`recipe-section ${className}`} 
      id={id}
      style={{ display: hidden ? 'none' : 'block' }}
    >
      <h2>{title}</h2>
      <div className="recipe-inputs">
        {children}
      </div>
    </section>
  );
}