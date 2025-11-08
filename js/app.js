import { initToggleClosed, analyzePreElements, initPreLinkification } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  initToggleClosed();
  analyzePreElements();
  initPreLinkification();
});
