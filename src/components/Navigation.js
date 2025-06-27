export class Navigation {
    constructor() {
        this.activeTab = 'recipe-maker';
    }

    render() {
        return `
            <nav class="navbar">
                <div class="container">
                    <a href="#" class="nav-brand">
                        🍞✨ Dough Playground ✨🥖
                    </a>
                    <button class="nav-toggle" onclick="toggleMenu()">
                        ☰
                    </button>
                    <ul class="nav-menu" id="navMenu">
                        <li><a href="#" class="nav-link active" onclick="showTab('recipe-maker', this)">🍞 Recipe Maker</a></li>
                        <li><a href="#" class="nav-link" onclick="showTab('fermentation', this)">🧪 Fermentation Predictor</a></li>
                        <li><a href="#" class="nav-link" onclick="showTab('optimization', this)">📊 Model Optimization</a></li>
                        <li><a href="#" class="nav-link" onclick="showTab('advanced', this)">🤖 Advanced Models</a></li>
                    </ul>
                </div>
            </nav>
        `;
    }

    bindEvents() {
        // Navigation toggle for mobile
        window.toggleMenu = () => {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        };

        // Tab switching
        window.showTab = (tabName, linkElement) => {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            const selectedTab = document.getElementById(tabName);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            linkElement.classList.add('active');
            
            this.activeTab = tabName;
        };
    }
}