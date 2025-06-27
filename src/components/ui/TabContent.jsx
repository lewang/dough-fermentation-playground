import { h } from 'preact';

export function TabContent({ 
  id, 
  children, 
  active = false, 
  className = '' 
}) {
  return (
    <div 
      id={id} 
      className={`tab-content ${active ? 'active' : ''} ${className}`}
    >
      <div className="content-container">
        {children}
      </div>
    </div>
  );
}