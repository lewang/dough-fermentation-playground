import './styles/main.css';
import { Navigation } from './components/Navigation.js';
import { RecipeMaker } from './pages/RecipeMaker.js';
import { FermentationPredictor } from './pages/FermentationPredictor.js';

class App {
    constructor() {
        this.navigation = new Navigation();
        this.recipeMaker = new RecipeMaker();
        this.fermentationPredictor = new FermentationPredictor();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            ${this.navigation.render()}
            
            <main class="main-content">
                <div class="container">
                    ${this.recipeMaker.render()}
                    ${this.fermentationPredictor.render()}
                    
                    <!-- Placeholder tabs for now -->
                    <div id="optimization" class="tab-content">
                        <div class="content-container">
                            <h1 class="text-center">📊 Model Optimization</h1>
                            <p class="text-center text-grey">Model optimization features coming soon...</p>
                        </div>
                    </div>
                    
                    <div id="advanced" class="tab-content">
                        <div class="content-container">
                            <h1 class="text-center">🤖 Advanced Models</h1>
                            <p class="text-center text-grey">Advanced modeling features coming soon...</p>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    bindEvents() {
        this.navigation.bindEvents();
        this.recipeMaker.bindEvents();
        this.fermentationPredictor.bindEvents();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});