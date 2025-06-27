(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(e){if(e.ep)return;e.ep=!0;const n=s(e);fetch(e.href,n)}})();class r{constructor(){this.activeTab="recipe-maker"}render(){return`
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
        `}bindEvents(){window.toggleMenu=()=>{document.getElementById("navMenu").classList.toggle("active")},window.showTab=(t,s)=>{document.querySelectorAll(".tab-content").forEach(e=>{e.classList.remove("active")});const i=document.getElementById(t);i&&i.classList.add("active"),document.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("active")}),s.classList.add("active"),this.activeTab=t}}}class c{constructor(){this.recipeName="New Recipe"}render(){return`
            <div id="recipe-maker" class="tab-content active">
                <div class="content-container">
                    <div class="recipe-header">
                        <h1 class="recipe-name">${this.recipeName}</h1>
                        <span class="edit-icon" onclick="editRecipeName()" title="Edit recipe name">✏️</span>
                    </div>
                    
                    <!-- Section 1: Mandatory Inputs -->
                    <section class="recipe-section mandatory">
                        <h2>🍞 Main Dough</h2>
                        <div class="recipe-inputs">
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="doughPortions">Dough Portions</label>
                                    <input type="number" id="doughPortions" value="1" min="1" onchange="updateRecipe()">
                                </div>
                                <div class="input-group main-input">
                                    <label for="portionWeight">Portion Weight</label>
                                    <input type="number" id="portionWeight" value="500" min="1" onchange="updateRecipe()">
                                    <span class="unit">g</span>
                                </div>
                            </div>
                            
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="hydrationPercent">Hydration</label>
                                    <input type="number" id="hydrationPercent" value="72" min="1" max="200" step="0.1" onchange="updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                                <div class="input-group main-input">
                                    <label for="saltPercent">Salt</label>
                                    <input type="number" id="saltPercent" value="2.2" min="0" max="10" step="0.1" onchange="updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                            </div>
                            
                            <div class="input-row">
                                <div class="input-group main-input">
                                    <label for="leaveningType">Leavening</label>
                                    <select id="leaveningType" onchange="updateLeaveningInputs()">
                                        <option value="active-dry-yeast">Active Dry Yeast</option>
                                        <option value="instant-yeast">Instant Yeast</option>
                                        <option value="cake-yeast">Cake Yeast</option>
                                        <option value="sourdough-starter">Sourdough Starter</option>
                                        <option value="poolish">Poolish</option>
                                    </select>
                                </div>
                                <!-- Yeast % in same row as Leavening -->
                                <div id="yeastInputs" class="input-group main-input">
                                    <label for="yeastPercent">Yeast</label>
                                    <input type="number" id="yeastPercent" value="0.210" step="0.001" min="0" onchange="updateRecipe()">
                                    <span class="unit">baker%</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <!-- Recipe Output -->
                    <section class="recipe-output">
                        <h2>📋 Recipe</h2>
                        <div id="recipeDisplay" class="recipe-display">
                            <!-- Calculated ingredients will appear here -->
                        </div>
                    </section>
                </div>
            </div>
        `}bindEvents(){window.editRecipeName=()=>{const t=document.querySelector(".recipe-name"),s=t.textContent,i=prompt("Enter recipe name:",s);i&&i.trim()&&(this.recipeName=i.trim(),t.textContent=this.recipeName)},window.updateRecipe=()=>{console.log("Recipe updated")},window.updateLeaveningInputs=()=>{console.log("Leavening inputs updated")}}}class l{render(){return`
            <div id="fermentation" class="tab-content">
                <div class="content-container">
                    <h1 class="text-center">🧪 Fermentation Predictor</h1>
                    <p class="text-center text-grey">Enter any 2 parameters to predict the third using the Arrhenius kinetics model</p>
                    
                    <div class="row">
                        <div class="col-6">
                            <label for="temperature">Temperature (°C)</label>
                            <input type="number" id="temperature" step="0.1" min="1" max="50" placeholder="e.g., 15.0">
                            <small class="text-grey">Range: 1-50°C</small>
                        </div>
                        
                        <div class="col-6">
                            <label for="yeast">Yeast Concentration (%)</label>
                            <input type="number" id="yeast" step="0.001" min="0.001" max="1" placeholder="e.g., 0.1">
                            <small class="text-grey">Range: 0.001-1.0%</small>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col">
                            <label for="time">Fermentation Time (hours)</label>
                            <input type="number" id="time" step="0.1" min="0.1" max="500" placeholder="e.g., 50">
                            <small class="text-grey">Range: 0.1-500 hours</small>
                        </div>
                    </div>
                    
                    <div class="text-center" style="margin: 2rem 0;">
                        <button class="button primary" onclick="calculateFermentation()">🧪 Calculate</button>
                        <button class="button" onclick="clearFermentationInputs()">Clear</button>
                    </div>
                    
                    <div id="fermentationResult" class="result-box">
                        <div id="fermentationResultContent"></div>
                    </div>
                    
                    <div id="fermentationError" class="error-box">
                        <div id="fermentationErrorContent"></div>
                    </div>
                </div>
            </div>
        `}bindEvents(){window.calculateFermentation=()=>{console.log("Calculate fermentation")},window.clearFermentationInputs=()=>{document.getElementById("temperature").value="",document.getElementById("yeast").value="",document.getElementById("time").value="",document.getElementById("fermentationResult").classList.remove("show"),document.getElementById("fermentationError").classList.remove("show")}}}class d{constructor(){this.navigation=new r,this.recipeMaker=new c,this.fermentationPredictor=new l}init(){this.render(),this.bindEvents()}render(){const t=document.getElementById("app");t.innerHTML=`
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
        `}bindEvents(){this.navigation.bindEvents(),this.recipeMaker.bindEvents(),this.fermentationPredictor.bindEvents()}}document.addEventListener("DOMContentLoaded",()=>{new d().init()});
