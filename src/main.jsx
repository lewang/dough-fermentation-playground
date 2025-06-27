import { h, render } from 'preact';
import { App } from './App.jsx';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  if (appElement) {
    render(h(App), appElement);
  }
});