console.log("FAIZAN Math AI loaded");

const $ = (id) => document.getElementById(id);
const input = $("mathInput");
const variableSelect = $("variableSelect");
const solveBtn = $("solveBtn");
const clearBtn = $("clearBtn");
const imageInput = $("imageInput");
const imagePreviewBox = $("imagePreviewBox");
const imagePreview = $("imagePreview");
const ocrStatus = $("ocrStatus");
const removeImageBtn = $("removeImageBtn");
const resultBox = $("resultBox");
const resultText = $("resultText");
const errorBox = $("errorBox");

function showResult(text) {
  resultText.textContent = text;
  resultBox.classList.remove("hidden");
  errorBox.classList.add("hidden");
}
function showError(text) {
  errorBox.textContent = text;
  errorBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
}
function cleanExpression(s) {
  return s
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/∞/g, "infinity")
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/\s+/g, " ")
    .trim();
}
function normalizeOCR(s) {
  return s
    .replace(/\|/g, "1")
    .replace(/[Oo]/g, "0")
    .replace(/[lI]/g, "1")
    .replace(/S/g, "5")
    .replace(/(\d)\s*x/g, "$1x")
    .replace(/x\s*(\d+)/g, "x^$1");
}
function implicitMultiplication(s) {
  return s
    .replace(/(\d)([a-zA-Z])/g, "$1*$2")
    .replace(/([a-zA-Z])(\d)/g, "$1*$2")
    .replace(/(\))([a-zA-Z0-9])/g, "$1*$2")
    .replace(/([a-zA-Z0-9])\(/g, "$1*(");
}
function solveMath(raw) {
  let expr = implicitMultiplication(cleanExpression(raw));
  if (!expr) throw new Error("Please enter a math problem.");

  // Friendly command syntax
  if (/^derivative\s*\(/i.test(expr) || /^diff\s*\(/i.test(expr)) {
    return nerdamer(expr).text("LaTeX");
  }
  if (/^integrate\s*\(/i.test(expr) || /^integral\s*\(/i.test(expr)) {
    return nerdamer(expr).text("LaTeX");
  }
  if (/^factor\s*\(/i.test(expr) || /^expand\s*\(/i.test(expr) || /^simplify\s*\(/i.test(expr)) {
    return nerdamer(expr).text("LaTeX");
  }

  // Equation solving
  if (expr.includes("=")) {
    const eq = expr.split("=");
    if (eq.length === 2) {
      const left = eq[0].trim(), right = eq[1].trim();
      const variable = variableSelect.value;
      const solutions = nerdamer.solveEquations(`${left}=${right}`, variable);
      if (solutions && solutions.length) {
        return solutions.map((v, i) => `Solution ${i + 1}: ${v}`).join("\n");
      }
    }
  }

  // Try symbolic simplification for expressions without =
  return nerdamer(expr).text("LaTeX");
}
function solveCurrentInput() {
  try {
    const answer = solveMath(input.value);
    showResult(answer);
  } catch (err) {
    showError("Could not solve this expression. Check the notation and try again. " + (err.message || ""));
  }
}

solveBtn.addEventListener("click", solveCurrentInput);
input.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") solveCurrentInput();
});
clearBtn.addEventListener("click", () => {
  input.value = "";
  resultBox.classList.add("hidden");
  errorBox.classList.add("hidden");
  imagePreviewBox.classList.add("hidden");
  imageInput.value = "";
});
document.querySelectorAll("[data-example]").forEach(btn => {
  btn.addEventListener("click", () => {
    input.value = btn.dataset.example;
    solveCurrentInput();
  });
});

// Image OCR
imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showError("Please select a valid image file.");
    return;
  }

  imagePreview.src = URL.createObjectURL(file);
  imagePreviewBox.classList.remove("hidden");
  ocrStatus.textContent = "Reading the image... This may take a little time.";

  try {
    const result = await Tesseract.recognize(file, "eng", {
      logger: info => {
        if (info.status === "recognizing text") {
          ocrStatus.textContent = `Reading image: ${Math.round((info.progress || 0) * 100)}%`;
        } else if (info.status) {
          ocrStatus.textContent = info.status;
        }
      }
    });

    const rawText = result.data.text.trim();
    if (!rawText) throw new Error("No readable text was found.");

    const cleaned = normalizeOCR(cleanExpression(rawText));
    input.value = cleaned;
    ocrStatus.textContent = "Image text extracted. You can check it and press Solve Math.";
    showResult("Detected from image:\n" + cleaned + "\n\nPress “Solve Math” to calculate it.");
  } catch (err) {
    ocrStatus.textContent = "";
    showError("Image reading failed. Use a clear, straight, well-lit math image. " + (err.message || ""));
  }
});
removeImageBtn.addEventListener("click", () => {
  imageInput.value = "";
  imagePreview.src = "";
  imagePreviewBox.classList.add("hidden");
});

// Animated background
const bg = $("mathBackground");
const symbols = ["+","−","×","÷","√","π","∑","∫","=","∞","x²","y²","a+b","sin","cos","tan","Δ","∂","∇","f(x)","Σ","θ","α","β","λ","x+y","a²","dy/dx"];
const objects = [];
const count = window.innerWidth < 600 ? 22 : 44;

for (let i = 0; i < count; i++) {
  const el = document.createElement("div");
  el.className = "math-object " + ["small","medium","large","huge"][Math.floor(Math.random()*4)];
  el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
  el.dataset.x = (Math.random()*100).toFixed(2);
  el.dataset.y = (Math.random()*100).toFixed(2);
  el.dataset.depth = (0.2 + Math.random()*1.1).toFixed(2);
  el.dataset.speed = (0.0003 + Math.random()*0.0008).toFixed(5);
  el.dataset.phase = (Math.random()*Math.PI*2).toFixed(2);
  el.style.left = el.dataset.x + "%";
  el.style.top = el.dataset.y + "%";
  el.style.opacity = (0.10 + Math.random()*0.22).toFixed(2);
  el.style.transform = `rotate(${Math.random()*360}deg)`;
  bg.appendChild(el);
  objects.push(el);
}

["a","b","c"].forEach(c => {
  const orb = document.createElement("div");
  orb.className = "bg-orb " + c;
  bg.appendChild(orb);
});

const glow = document.querySelector(".cursor-glow");
let mouseX = innerWidth/2, mouseY = innerHeight/2, targetX = mouseX, targetY = mouseY;
let scrollY = 0;

window.addEventListener("mousemove", e => {
  targetX = e.clientX;
  targetY = e.clientY;
  if (glow) {
    glow.style.left = targetX + "px";
    glow.style.top = targetY + "px";
  }
});
window.addEventListener("scroll", () => scrollY = window.scrollY, {passive:true});

let time = 0;
function animate() {
  time += 0.016;
  mouseX += (targetX - mouseX) * 0.07;
  mouseY += (targetY - mouseY) * 0.07;

  objects.forEach((el, i) => {
    const depth = Number(el.dataset.depth);
    const baseX = Number(el.dataset.x);
    const baseY = Number(el.dataset.y);
    const phase = Number(el.dataset.phase);
    const floatX = Math.sin(time * 0.55 + phase) * 12;
    const floatY = Math.cos(time * 0.45 + phase) * 14;
    const parallaxX = ((mouseX / innerWidth) - 0.5) * depth * 55;
    const parallaxY = ((mouseY / innerHeight) - 0.5) * depth * 45;
    const scrollParallax = (scrollY * depth * 0.025);
    el.style.transform =
      `translate(${floatX + parallaxX}px, ${floatY + parallaxY - scrollParallax}px) rotate(${Math.sin(time*.25+phase)*18}deg)`;
  });

  requestAnimationFrame(animate);
}
animate();

// Initial example
input.value = "x^2 - 5x + 6 = 0";
