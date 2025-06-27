import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Navigation({ activeTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'recipe-maker', label: '🍞 Recipe Maker' },
    { id: 'fermentation', label: '🧪 Fermentation Predictor' },
    { id: 'optimization', label: '📊 Model Optimization' },
    { id: 'advanced', label: '🤖 Advanced Models' }
  ];

  const handleTabClick = (tabId) => {
    onTabChange?.(tabId);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <a href="#" className="nav-brand">
          🍞✨ Dough Playground ✨🥖
        </a>
        <button className="nav-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {tabs.map(tab => (
            <li key={tab.id}>
              <a 
                href="#" 
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(tab.id);
                }}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}