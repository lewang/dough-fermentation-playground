# 🍞 Dough Playground

A modern, interactive web application for bread making calculations, fermentation prediction, and timeline planning. Built with Vite for fast development and optimized production builds.

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
│   ├── components/               # Reusable components
│   │   └── Navigation.js         # Navigation bar component
│   ├── pages/                    # Page components
│   │   ├── RecipeMaker.js        # Recipe maker tab
│   │   └── FermentationPredictor.js # Fermentation predictor tab
│   ├── styles/                   # CSS modules
│   │   ├── variables.css         # CSS custom properties
│   │   ├── base.css             # Base styles
│   │   ├── navigation.css       # Navigation styles
│   │   ├── components.css       # Component styles
│   │   ├── forms.css            # Form styles
│   │   ├── recipe-maker.css     # Recipe maker specific styles
│   │   └── main.css             # Main CSS entry point
│   ├── scripts/                 # JavaScript utilities
│   ├── index.html               # Main application page
│   ├── gantt.html              # Gantt chart page
│   └── main.js                 # Application entry point
├── public/                      # Static assets
├── dist/                       # Production build output
├── .github/workflows/          # GitHub Actions
│   └── deploy.yml             # Deployment workflow
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Live Development

The development server supports:
- **Hot Module Replacement (HMR)** - Changes reflect immediately
- **CSS Hot Reload** - Style changes update without page refresh
- **ES Module support** - Modern JavaScript imports/exports
- **Source maps** - Debug with original source code

### Adding New Features

1. **New Page Component:**
   - Create in `src/pages/NewPage.js`
   - Import and add to `src/main.js`
   - Add navigation link in `src/components/Navigation.js`

2. **New Reusable Component:**
   - Create in `src/components/ComponentName.js`
   - Export as ES module class
   - Import where needed

3. **New Styles:**
   - Add component-specific CSS in `src/styles/`
   - Import in `src/styles/main.css`
   - Use CSS custom properties from `variables.css`

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
- Interactive bread recipe calculator
- Baker's percentage calculations
- Real-time ingredient updates
- Recipe sharing via URL

### Fermentation Predictor
- Arrhenius kinetics model
- Temperature and time predictions
- Visual fermentation timeline

### Gantt Chart Playground
- Interactive D3.js timeline visualization
- Natural language date parsing
- Export capabilities

## 🔧 Configuration

### Vite Configuration
See `vite.config.js` for:
- Multi-page application setup
- Build optimization
- Development server configuration

### GitHub Pages
The site deploys to: `https://username.github.io/repository-name`

Configure in repository settings:
1. Go to Settings → Pages
2. Source: GitHub Actions
3. The workflow will handle deployment

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