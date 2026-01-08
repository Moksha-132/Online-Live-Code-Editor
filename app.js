const config = {
  theme: "ace/theme/dracula",
  font: "16px",
  tabSize: 2
};

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
  htmlEditor.setTheme(config.theme);
  cssEditor.setTheme(config.theme);
  jsEditor.setTheme(config.theme);

  // Update icons
  document.getElementById('sun-icon').style.display = currentTheme === 'dark' ? 'block' : 'none';
  document.getElementById('moon-icon').style.display = currentTheme === 'dark' ? 'none' : 'block';
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateEditorThemes();
});

var htmlEditor = ace.edit("html");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.setValue(`<!-- Premium Neon Clock -->
<div class="clock-wrap">
  <div class="clock-face">
    <div id="time">00:00:00</div>
    <div id="date">JANUARY 01, 2026</div>
  </div>
</div>`, 1);
htmlEditor.setOptions({ showPrintMargin: false, fontSize: config.font, tabSize: config.tabSize });
htmlEditor.setHighlightActiveLine(true);

var cssEditor = ace.edit("css");
cssEditor.session.setMode("ace/mode/css");
cssEditor.setValue(`/* Neon Glassmorphism Clock */
:root {
  --neon-blue: #00e5ff;
  --neon-purple: #7c4dff;
}

body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0c0d11;
  font-family: 'Outfit', sans-serif;
  color: white;
}

.clock-wrap {
  position: relative;
  padding: 4px;
  background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
  border-radius: 40px;
  box-shadow: 0 0 40px rgba(124, 77, 255, 0.3);
}

.clock-face {
  background: rgba(12, 13, 17, 0.9);
  backdrop-filter: blur(20px);
  padding: 60px 80px;
  border-radius: 36px;
  text-align: center;
}

#time {
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

#date {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--neon-blue);
  letter-spacing: 4px;
  text-transform: uppercase;
  opacity: 0.8;
}`, 1);
cssEditor.setOptions({ showPrintMargin: false, fontSize: config.font, tabSize: config.tabSize });
cssEditor.setHighlightActiveLine(true);

var jsEditor = ace.edit("js");
jsEditor.session.setMode("ace/mode/javascript");
jsEditor.setValue(`// Smooth Real-time Clock Logic
function updateClock() {
  const now = new Date();
  
  // Time
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  document.getElementById('time').textContent = timeStr;
  
  // Date
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: '2-digit', 
    year: 'numeric' 
  });
  document.getElementById('date').textContent = dateStr;
}

setInterval(updateClock, 1000);
updateClock();`, 1);
jsEditor.setOptions({ showPrintMargin: false, fontSize: config.font, tabSize: config.tabSize });
jsEditor.setHighlightActiveLine(true);

updateEditorThemes();

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
  doc.setTextColor(124, 77, 255); // Purple accent
  doc.text("--- HTML ---", 20, 50);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const htmlLines = doc.splitTextToSize(html, 170);
  doc.text(htmlLines, 20, 60);

  // Check for page break or new page
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
