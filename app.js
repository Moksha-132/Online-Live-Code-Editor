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
  const theme = currentTheme === 'dark' ? config.darkTheme : config.lightTheme;
  htmlEditor.setTheme(theme);
  cssEditor.setTheme(theme);
  jsEditor.setTheme(theme);

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

function downloadCode() {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();
  const code = `--- HTML ---\\n${html}\\n\\n--- CSS ---\\n${css}\\n\\n--- JavaScript ---\\n${js}`;
  const blob = new Blob([code], { type: "text/plain" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "code.txt";
  a.click();
  URL.revokeObjectURL(a.href);
}
