import { h } from 'preact';

export function Button({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'button';
  const variantClasses = {
    default: '',
    primary: 'primary',
    danger: 'danger'
  };
  const sizeClasses = {
    small: 'small',
    medium: '',
    large: 'large'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}