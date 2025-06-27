# 🛠 Development Guide

This guide covers detailed development practices for the Dough Playground project.

## 🚀 Getting Started for Development

### Initial Setup
```bash
# Clone and install
git clone <repository-url>
cd fermentation_web_play
npm install

# Start development server
npm run dev

# Open in browser (should auto-open)
# http://localhost:3000
```

### Development Workflow

1. **Start dev server:** `npm run dev` (runs with hot reload)
2. **Make changes** to files in `src/`
3. **Browser auto-refreshes** with changes
4. **Test build:** `npm run build` before committing
5. **Preview production:** `npm run preview`

## 📁 Adding New Features

### Adding a New Tab/Page

1. **Create page component:**
```javascript
// src/pages/NewFeature.js
export class NewFeature {
    render() {
        return `
            <div id="new-feature" class="tab-content">
                <div class="content-container">
                    <h1>🆕 New Feature</h1>
                    <!-- Your content here -->
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Event handlers
    }
}
```

2. **Add to main app:**
```javascript
// src/main.js
import { NewFeature } from './pages/NewFeature.js';

class App {
    constructor() {
        this.newFeature = new NewFeature();
    }
    
    render() {
        app.innerHTML = `
            ${this.navigation.render()}
            <main class="main-content">
                ${this.newFeature.render()}
            </main>
        `;
    }
    
    bindEvents() {
        this.newFeature.bindEvents();
    }
}
```

3. **Add navigation link:**
```javascript
// src/components/Navigation.js - update render() method
<li><a href="#" class="nav-link" onclick="showTab('new-feature', this)">🆕 New Feature</a></li>
```

### Adding Styles

1. **Create component-specific CSS:**
```css
/* src/styles/new-feature.css */
.new-feature-container {
    background: var(--surface-color);
    border-radius: 8px;
    padding: 1rem;
}
```

2. **Import in main CSS:**
```css
/* src/styles/main.css */
@import url('./new-feature.css');
```

## 🎨 Styling Guidelines

### CSS Custom Properties
Always use CSS custom properties for consistent theming:

```css
/* Good */
.my-component {
    background: var(--surface-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

/* Avoid */
.my-component {
    background: #ffffff;
    color: #212529;
    border: 1px solid #dee2e6;
}
```

### Dark Mode Support
Use the automatic dark mode pattern:

```css
/* Light mode defined in :root */
:root {
    --my-color: #ffffff;
}

/* Dark mode override */
@media (prefers-color-scheme: dark) {
    :root {
        --my-color: #212529;
    }
}
```

### Responsive Design
Use mobile-first responsive design:

```css
/* Mobile first */
.component {
    display: flex;
    flex-direction: column;
}

/* Desktop enhancement */
@media (min-width: 768px) {
    .component {
        flex-direction: row;
    }
}
```

## 🔧 Component Architecture

### Class-Based Components
Use ES6 classes for components:

```javascript
export class MyComponent {
    constructor(options = {}) {
        this.options = options;
        this.state = {};
    }

    render() {
        return `<div class="my-component">...</div>`;
    }

    bindEvents() {
        // Event listeners
        window.myHandler = () => {
            // Handle events
        };
    }

    update(newState) {
        this.state = { ...this.state, ...newState };
        // Re-render if needed
    }
}
```

### Event Handling
Use global functions for HTML onclick handlers:

```javascript
bindEvents() {
    window.myClickHandler = (param) => {
        // Handle click
        this.handleClick(param);
    };
}

handleClick(param) {
    // Internal method
}
```

## 📦 File Organization

### Directory Structure
```
src/
├── components/        # Reusable UI components
├── pages/            # Page-level components
├── styles/           # CSS files
├── scripts/          # Utility functions
├── assets/           # Images, fonts, etc.
└── main.js          # App entry point
```

### Naming Conventions
- **Files:** PascalCase for components (`RecipeMaker.js`)
- **CSS:** kebab-case for files (`recipe-maker.css`)
- **Classes:** PascalCase (`class RecipeMaker`)
- **CSS classes:** kebab-case (`.recipe-maker`)

## 🧪 Testing Changes

### Before Committing
```bash
# Test development build
npm run dev

# Test production build
npm run build

# Test production preview
npm run preview

# Check for any console errors
```

### Browser Testing
- **Chrome/Safari:** Primary development browsers
- **Firefox:** Secondary testing
- **Mobile:** Use browser dev tools responsive mode

## 🚀 Deployment Process

### Automatic Deployment (Recommended)
1. Push changes to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site updates at GitHub Pages URL

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder contents to hosting platform
```

## 🐛 Common Issues & Solutions

### Vite Dev Server Issues
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### CSS Not Loading
- Check import syntax in `main.css`
- Ensure file paths are correct
- Restart dev server

### Build Errors
- Check JavaScript syntax
- Ensure all imports are valid
- Clear node_modules if needed: `rm -rf node_modules && npm install`

### Hot Reload Not Working
- Check browser console for errors
- Restart Vite dev server
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

## 📈 Performance Optimization

### CSS
- Use CSS custom properties for consistency
- Minimize CSS specificity
- Group related styles in same file

### JavaScript
- Use ES modules for better tree-shaking
- Avoid global variables (use class properties)
- Lazy load large features if needed

### Assets
- Optimize images before adding to `public/`
- Use modern image formats (WebP, AVIF)
- Leverage Vite's asset optimization

## 🔍 Debugging

### Development Tools
- **Browser DevTools:** Network, Console, Elements tabs
- **Vite DevTools:** Check terminal for build info
- **Source Maps:** Enabled for debugging original source

### Console Debugging
```javascript
// Temporary debugging
console.log('Debug info:', data);

// Remove before committing
```

### Network Issues
- Check Network tab in DevTools
- Verify all assets are loading
- Check for CORS issues with external APIs

## 📝 Code Quality

### Best Practices
- Use meaningful variable/function names
- Keep functions small and focused
- Comment complex logic
- Use consistent indentation

### Before Pull Request
- [ ] Code builds without errors
- [ ] No console errors in browser
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] All features function as expected

This development guide should help you contribute effectively to the Dough Playground project!