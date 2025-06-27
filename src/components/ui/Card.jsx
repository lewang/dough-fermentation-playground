import { h } from 'preact';

export function Card({ 
  children, 
  title, 
  className = '',
  actions,
  ...props 
}) {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export function CardGrid({ children, columns = 'auto-fit', minWidth = '300px' }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(${minWidth}, 1fr))`,
    gap: '1rem'
  };

  return (
    <div style={gridStyle}>
      {children}
    </div>
  );
}