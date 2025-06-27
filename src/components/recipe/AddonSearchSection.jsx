import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

export function AddonSearchSection({ availableAddons, activeAddons, onAddAddon }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef();

  const filterSuggestions = (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      return availableAddons.filter(addon => !activeAddons.has(addon.id));
    }
    
    return availableAddons.filter(addon => 
      addon.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !activeAddons.has(addon.id)
    );
  };

  const handleInputChange = (value) => {
    setQuery(value);
    const filtered = filterSuggestions(value);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    const filtered = filterSuggestions(query);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const addAddon = (addonId) => {
    onAddAddon?.(addonId);
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          addAddon(suggestions[selectedIndex].id);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        searchRef.current?.blur();
        break;
    }
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
    <section className="addon-search-section">
      <h2>✨ Add Ingredients/Processes</h2>
      <div className="search-container" ref={searchRef}>
        <input
          type="text"
          placeholder="Type to add: TangZhong, Whole Wheat Flour, Oil, etc."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
        <div className={`suggestions-dropdown ${showSuggestions ? 'show' : ''}`}>
          {suggestions.map((addon, index) => (
            <div
              key={addon.id}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => addAddon(addon.id)}
            >
              {addon.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}