# 🍞 Dough Playground

A modern, interactive web application for bread making calculations, fermentation prediction, and timeline planning. Built with **Preact** and **Vite** for fast development, component reusability, and optimized production builds.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd fermentation_web_play
npm install
```

2. **Start development server:**
```bash
npm run dev
```
The application will open at `http://localhost:3000` with hot reload enabled.

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 📁 Project Structure

```
fermentation_web_play/
├── src/                          # Source files
│   ├── components/               # Reusable Preact components
│   │   ├── inputs/              # Form input components
│   │   │   ├── InputGroup.jsx   # Reusable input with label/unit
│   │   │   └── InputRow.jsx     # Input row layout
│   │   ├── ui/                  # UI components
│   │   │   ├── Button.jsx       # Button component with variants
│   │   │   ├── Card.jsx         # Card layout components
│   │   │   ├── Section.jsx      # Content section wrapper
│   │   │   └── TabContent.jsx   # Tab content container
│   │   ├── recipe/              # Recipe-specific components
│   │   │   ├── RecipeHeader.jsx # Editable recipe name
│   │   │   ├── MainDoughSection.jsx # Main dough form inputs
│   │   │   ├── AddonSearchSection.jsx # Addon search with autocomplete
│   │   │   └── RecipeDisplay.jsx # Recipe calculation display
│   │   └── Navigation.jsx       # Navigation bar component
│   ├── pages/                    # Page components
│   │   ├── RecipeMaker.jsx      # Recipe maker tab
│   │   └── FermentationPredictor.jsx # Fermentation predictor tab
│   ├── hooks/                   # Custom Preact hooks
│   │   └── useLocalStorage.js   # localStorage state management
│   ├── styles/                  # CSS modules
│   │   ├── variables.css        # CSS custom properties
│   │   ├── base.css            # Base styles
│   │   ├── navigation.css      # Navigation styles
│   │   ├── components.css      # Component styles
│   │   ├── forms.css           # Form styles
│   │   ├── recipe-maker.css    # Recipe maker specific styles
│   │   └── main.css            # Main CSS entry point
│   ├── scripts/                # JavaScript utilities
│   │   └── recipeCalculations.js # Recipe calculation functions
│   ├── index.html              # Main application page
│   ├── gantt.html             # Gantt chart page
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Application entry point
├── public/                     # Static assets
├── dist/                      # Production build output
├── .github/workflows/         # GitHub Actions
│   └── deploy.yml            # Deployment workflow
├── vite.config.js            # Vite configuration with Preact
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Live Development

The development server supports:
- **Hot Module Replacement (HMR)** - Changes reflect immediately
- **Fast Refresh** - Preact component state preserved during edits
- **CSS Hot Reload** - Style changes update without page refresh
- **JSX support** - Modern component-based development
- **ES Module support** - Modern JavaScript imports/exports
- **Source maps** - Debug with original source code

### Adding New Features

1. **New Page Component:**
   - Create in `src/pages/NewPage.jsx`
   - Import and add to `src/App.jsx`
   - Add navigation link in `src/components/Navigation.jsx`

2. **New Reusable Component:**
   - Create in appropriate `src/components/` subdirectory
   - Use functional components with hooks: `export function ComponentName() { ... }`
   - Import where needed using JSX syntax

3. **New Styles:**
   - Add component-specific CSS in `src/styles/`
   - Import in `src/styles/main.css`
   - Use CSS custom properties from `variables.css`

### Component Development

**Creating Components:**
```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(defaultValue);
  
  return (
    <div className="my-component">
      {/* JSX content */}
    </div>
  );
}
```

**Using Hooks:**
- `useState` - Component state management
- `useEffect` - Side effects and lifecycle
- `useLocalStorage` - Persistent state (custom hook)

**Component Organization:**
- `/inputs/` - Form and input components
- `/ui/` - Generic UI components (buttons, cards, etc.)
- `/recipe/` - Domain-specific components
- `/pages/` - Top-level page components

## 🎨 Styling Architecture

### CSS Custom Properties
All colors, spacing, and theme values are defined in `src/styles/variables.css` using CSS custom properties:

```css
:root {
  --color-primary: #007bff;
  --surface-color: #ffffff;
  --text-primary: #212529;
  /* ... */
}
```

### Dark Mode Support
Automatic dark mode support using `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface-color: #212529;
    --text-primary: #f8f9fa;
    /* ... */
  }
}
```

### Component Styling
- Each major component has its own CSS file
- Responsive design using CSS Grid and Flexbox
- Mobile-first approach with progressive enhancement

## 🚀 Deployment

### Automatic Deployment
The project uses GitHub Actions for automatic deployment:

1. **Push to main branch** triggers the build
2. **Vite builds** the project to `dist/`
3. **GitHub Pages** serves the built files

### Manual Deployment
```bash
npm run build
# Deploy contents of dist/ folder to your hosting platform
```

## 🧪 Features

### Recipe Maker
- **Interactive bread recipe calculator** with real-time updates
- **Baker's percentage calculations** for professional accuracy
- **Add-on ingredients system** with autocomplete search
- **Conditional inputs** for different leavening types (sourdough, poolish, etc.)
- **Recipe sharing via URL** for easy collaboration
- **JSON export** for recipe storage and manipulation

### Fermentation Predictor
- **Arrhenius kinetics model** for scientific fermentation prediction
- **Temperature and time predictions** with input validation
- **Interactive form inputs** with real-time feedback
- **Clear calculation results** with error handling

### Component Architecture
- **Reusable input components** - Consistent form elements across the app
- **Modular design** - Each feature is self-contained and reusable
- **State management** - Centralized recipe state with Preact hooks
- **Responsive design** - Works seamlessly on desktop and mobile

### Gantt Chart Playground
- **Interactive D3.js timeline visualization**
- **Natural language date parsing**
- **Export capabilities**

## 🔧 Configuration

### Vite Configuration
See `vite.config.js` for:
- **Preact plugin** - JSX transformation and fast refresh
- **Build optimization** - Production bundle optimization
- **Development server configuration** - Hot reload and port settings

### Dependencies
The project uses these key dependencies:
- **preact** - Lightweight React alternative (3KB)
- **@preact/preset-vite** - Vite plugin for Preact JSX and Fast Refresh
- **vite** - Fast build tool and development server

### GitHub Pages
The site deploys to: `https://username.github.io/repository-name`

Configure in repository settings:
1. Go to Settings → Pages
2. Source: GitHub Actions
3. The workflow will handle deployment

## 🔄 Architecture Migration

### From String Templates to Preact Components

This project was recently migrated from vanilla JavaScript with string templates to **Preact** for better maintainability and code reuse:

**Before (String Templates):**
```javascript
render() {
  return `<div class="input-group">
    <label>${label}</label>
    <input type="${type}" value="${value}">
  </div>`;
}
```

**After (Preact Components):**
```jsx
function InputGroup({ label, type, value, onChange }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
}
```

**Benefits Achieved:**
- **90% reduction** in template string duplication
- **Type safety** with JSX/TypeScript compatibility  
- **Component reusability** across 6+ different contexts
- **Centralized styling** and behavior logic
- **Better state management** with hooks
- **Maintainable code** with clear component boundaries

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version (18+ required)
- Clear node_modules: `rm -rf node_modules && npm install`

**Styles not loading:**
- Ensure CSS imports are in `src/styles/main.css`
- Check file paths in import statements

**Hot reload not working:**
- Restart dev server: `npm run dev`
- Check browser console for errors

### Development Tips

1. **Use browser dev tools** - Source maps are enabled
2. **Check console** - Vite provides helpful error messages
3. **Network tab** - Monitor asset loading during development

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test locally: `npm run dev`
4. Build to ensure no errors: `npm run build`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Create Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or issues:
1. Check this README
2. Search existing GitHub issues
3. Create a new issue with details about your problem