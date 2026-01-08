const config = {
  darkTheme: "ace/theme/tomorrow_night_eighties",
  lightTheme: "ace/theme/chrome",
  font: "16px",
  tabSize: 2
};

// Global Editor Instances
var htmlEditor, cssEditor, jsEditor;

function initEditors() {
  // HTML Editor
  htmlEditor = ace.edit("html");
  htmlEditor.session.setMode("ace/mode/html");
  htmlEditor.setValue(`<!-- Modern Design Card -->
<div class="card">
  <h2>Hello World</h2>
  <p>Start building your amazing web project today.</p>
  <button onclick="greet()">Interact</button>
</div>`, 1);
  htmlEditor.setOptions({ showPrintMargin: false, fontSize: config.font, tabSize: config.tabSize });
  htmlEditor.setHighlightActiveLine(true);

  // CSS Editor
  cssEditor = ace.edit("css");
  cssEditor.session.setMode("ace/mode/css");
  cssEditor.setValue(`/* Sleek Integrated Styling */
body {
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  font-family: 'Inter', sans-serif;
}

.card {
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  text-align: center;
  color: white;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

[data-theme="light"] .card {
  background: white;
  color: #1e293b;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

h2 { margin: 0 0 10px; font-family: 'Outfit', sans-serif; }
p { opacity: 0.7; margin-bottom: 25px; }

button {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
}`, 1);
  cssEditor.setOptions({ showPrintMargin: false, fontSize: config.font, tabSize: config.tabSize });
  cssEditor.setHighlightActiveLine(true);

  // JS Editor
  jsEditor = ace.edit("js");
  jsEditor.session.setMode("ace/mode/javascript");
  jsEditor.setValue(`// Simple Interactive Logic
function greet() {
  alert("The editor is ready for your code! 🚀");
}`, 1);
  jsEditor.setOptions({ showPrintMargin: false, fontSize: config.font, tabSize: config.tabSize });
  jsEditor.setHighlightActiveLine(true);
}

function compiler() {
  const htmlValue = htmlEditor.getValue();
  const cssValue = cssEditor.getValue();
  const jsValue = jsEditor.getValue();
  const resultFrame = document.getElementById("result");
  const result = resultFrame.contentWindow.document;

  result.open();
  result.writeln(
    `<style>${cssValue}</style>` +
    htmlValue +
    `<script>${jsValue}<\/script>`
  );
  result.close();
}

let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

function updateEditorThemes() {
  const theme = currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
  htmlEditor.setTheme(theme);
  cssEditor.setTheme(theme);
  jsEditor.setTheme(theme);

  // Update icons
  document.getElementById('sun-icon').style.display = currentTheme === 'dark' ? 'block' : 'none';
  document.getElementById('moon-icon').style.display = currentTheme === 'dark' ? 'none' : 'block';
}

// Global scope initialization
initEditors();
updateEditorThemes();

document.getElementById('theme-toggle').addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateEditorThemes();
});

const allButtons = document.querySelectorAll(".nav-btn");
const allPanels = document.querySelectorAll(".panel-wrapper");

function switchPanel(panelIndex) {
  allButtons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === panelIndex);
  });

  allPanels.forEach((panel, idx) => {
    panel.style.display = idx === panelIndex ? "block" : "none";
  });

  if (panelIndex === 0) htmlEditor.resize();
  if (panelIndex === 1) cssEditor.resize();
  if (panelIndex === 2) jsEditor.resize();
}

function runEdit(panelIndex) {
  switchPanel(panelIndex);
  compiler();
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    runEdit(3);
  }
});

switchPanel(0);

async function downloadCode() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Code Editor Export", 20, 20);

  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

  // HTML Section
  doc.setFontSize(18);
  doc.setTextColor(124, 77, 255);
  doc.text("--- HTML ---", 20, 50);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const htmlLines = doc.splitTextToSize(html, 170);
  doc.text(htmlLines, 20, 60);

  let currentY = 60 + (htmlLines.length * 5);
  if (currentY > 250) { doc.addPage(); currentY = 20; } else { currentY += 10; }

  // CSS Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(124, 77, 255);
  doc.text("--- CSS ---", 20, currentY);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const cssLines = doc.splitTextToSize(css, 170);
  doc.text(cssLines, 20, currentY + 10);

  currentY = currentY + 10 + (cssLines.length * 5);
  if (currentY > 250) { doc.addPage(); currentY = 20; } else { currentY += 10; }

  // JS Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(124, 77, 255);
  doc.text("--- JavaScript ---", 20, currentY);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const jsLines = doc.splitTextToSize(js, 170);
  doc.text(jsLines, 20, currentY + 10);

  doc.save("code_expert_export.pdf");
}
