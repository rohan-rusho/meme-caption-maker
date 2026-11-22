/* ==========================================================================
   MEME CAPTION MAKER — app logic
   Original canvas-drawn templates (no copyrighted photos, no external
   images), top/bottom caption inputs, live preview, PNG download.
   Canvas is 800x800. Captions use classic meme style: bold white text
   with a thick black outline.
   ========================================================================== */
(function () {
  "use strict";

  var W = 800;
  var H = 800;

  var canvas = document.getElementById("meme-canvas");
  var ctx = canvas.getContext("2d");
  var topInput = document.getElementById("top-text");
  var bottomInput = document.getElementById("bottom-text");
  var fontSizeInput = document.getElementById("font-size");
  var fontSizeLabel = document.getElementById("font-size-label");
  var downloadBtn = document.getElementById("download-btn");
  var randomBtn = document.getElementById("random-btn");
  var toastEl = document.getElementById("toast");
  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  var currentTemplate = "cat";
  var toastTimer = null;

  var RANDOM_CAPTIONS = [
    ["ME: I'LL GO TO BED EARLY", "ALSO ME AT 3AM"],
    ["NOBODY:", "ME AT 2AM: LET'S LEARN THE HARMONICA"],
    ["MY WALLET", "ME BUYING THINGS I DON'T NEED"],
    ["WHEN THE WIFI GOES DOWN", "FOR 5 SECONDS"],
    ["MY BRAIN DURING THE EXAM", "MY BRAIN AFTER THE EXAM"],
    ["ME: I HAVE SO MUCH TO DO", "ALSO ME: *WATCHES ONE MORE EPISODE*"],
    ["WHEN SOMEONE SAYS 'WE NEED TO TALK'", "MY HEART:"],
    ["MY PLANS", "2026"]
  ];

  /* ---------- Drawing helpers ---------- */

  function circle(x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function rect(x, y, w, h, fill, r) {
    ctx.beginPath();
    if (r) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function ellipse(x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function triangle(x1, y1, x2, y2, x3, y3, fill) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function skyAndGround(sky, ground) {
    rect(0, 0, W, H, sky);
    rect(0, 560, W, 240, ground);
  }

  function drawCloud(x, y, scale) {
    ctx.fillStyle = "#ffffff";
    circle(x, y, 42 * scale, "#ffffff");
    circle(x + 40 * scale, y - 14 * scale, 52 * scale, "#ffffff");
    circle(x + 88 * scale, y, 42 * scale, "#ffffff");
    rect(x - 42 * scale, y, 172 * scale, 42 * scale, "#ffffff", 20 * scale);
  }

  /* ---------- Templates (all original drawings) ---------- */

  // 1. Cat on a laptop — an orange cat sitting on a laptop, typing.
  function drawCat() {
    skyAndGround("#8ecae6", "#e9c46a");
    drawCloud(120, 130, 0.9);
    drawCloud(560, 90, 0.7);
    circle(660, 150, 46, "#ffd166"); // sun
    // desk
    rect(120, 560, 560, 26, "#8b5e3c", 8);
    rect(150, 586, 22, 110, "#6f4a2d");
    rect(628, 586, 22, 110, "#6f4a2d");
    // laptop
    rect(300, 400, 220, 160, "#3a3a3a", 10);
    rect(316, 414, 188, 128, "#a8d8ff", 6);
    rect(270, 556, 280, 16, "#555555", 8);
    // code lines on screen
    ctx.fillStyle = "#1d3557";
    rect(332, 432, 120, 12, "#1d3557", 4);
    rect(332, 454, 156, 12, "#2a9d8f", 4);
    rect(332, 476, 90, 12, "#e76f51", 4);
    rect(332, 498, 140, 12, "#1d3557", 4);
    // cat body (sitting behind laptop)
    ellipse(410, 420, 130, 110, "#f4a261");
    // cat head
    circle(410, 290, 92, "#f4a261");
    triangle(340, 230, 330, 160, 388, 205, "#f4a261");
    triangle(480, 230, 490, 160, 432, 205, "#f4a261");
    triangle(348, 214, 342, 176, 374, 200, "#ffb59d");
    triangle(472, 214, 478, 176, 446, 200, "#ffb59d");
    // face
    circle(378, 288, 10, "#1a1206");
    circle(442, 288, 10, "#1a1206");
    circle(382, 292, 3, "#ffffff");
    circle(446, 292, 3, "#ffffff");
    triangle(402, 312, 418, 312, 410, 324, "#e76f51");
    ctx.strokeStyle = "#1a1206";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(410, 324); ctx.quadraticCurveTo(396, 338, 384, 330); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(410, 324); ctx.quadraticCurveTo(424, 338, 436, 330); ctx.stroke();
    // whiskers
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(330, 300); ctx.lineTo(272, 288); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(330, 318); ctx.lineTo(274, 322); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(490, 300); ctx.lineTo(548, 288); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(490, 318); ctx.lineTo(546, 322); ctx.stroke();
    // paws on keyboard
    ellipse(340, 556, 34, 18, "#e76f51");
    ellipse(480, 556, 34, 18, "#e76f51");
    // tail
    ctx.strokeStyle = "#f4a261";
    ctx.lineWidth = 26;
    ctx.beginPath(); ctx.moveTo(520, 470); ctx.quadraticCurveTo(610, 460, 590, 380); ctx.stroke();
    // coffee mug
    rect(580, 500, 64, 60, "#e63946", 8);
    rect(644, 516, 22, 28, "#e63946", 8);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(596, 488); ctx.quadraticCurveTo(588, 472, 596, 458); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(616, 488); ctx.quadraticCurveTo(608, 472, 616, 458); ctx.stroke();
  }

  // 2. Two robots — one small robot showing off, one big robot unimpressed.
  function drawRobots() {
    skyAndGround("#b8c0ff", "#90be6d");
    drawCloud(100, 120, 0.8);
    drawCloud(520, 80, 0.7);
    circle(120, 110, 40, "#ffd166");
    // ground details
    circle(200, 660, 14, "#f9c74f");
    circle(620, 700, 18, "#f9c74f");
    rect(300, 690, 200, 10, "#6a994e", 5);
    // big robot (right, unimpressed)
    rect(480, 330, 200, 220, "#8d99ae", 24);
    rect(510, 250, 140, 90, "#8d99ae", 18);
    circle(580, 240, 10, "#ef233c");
    ctx.strokeStyle = "#6c757d";
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(580, 230); ctx.lineTo(580, 200); ctx.stroke();
    circle(580, 196, 12, "#ef233c");
    // eyes: flat line, unimpressed
    rect(528, 288, 34, 8, "#1a1206", 4);
    rect(598, 288, 34, 8, "#1a1206", 4);
    // mouth: straight line
    rect(556, 318, 48, 7, "#1a1206", 3);
    // arms down
    rect(452, 350, 28, 130, "#6c757d", 12);
    rect(680, 350, 28, 130, "#6c757d", 12);
    // legs
    rect(516, 550, 40, 90, "#6c757d", 10);
    rect(604, 550, 40, 90, "#6c757d", 10);
    // chest panel
    rect(540, 380, 80, 60, "#2b2d42", 10);
    circle(580, 410, 16, "#ffd166");
    // small robot (left, excited)
    rect(150, 430, 130, 130, "#ffb703", 18);
    rect(168, 370, 94, 64, "#ffb703", 14);
    circle(215, 362, 8, "#06d6a0");
    ctx.strokeStyle = "#8a6d00";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(215, 354); ctx.lineTo(215, 332); ctx.stroke();
    circle(215, 328, 10, "#06d6a0");
    // happy eyes
    circle(190, 398, 9, "#1a1206");
    circle(240, 398, 9, "#1a1206");
    // big smile
    ctx.strokeStyle = "#1a1206";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(215, 404, 22, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    // arms up, waving
    ctx.strokeStyle = "#8a6d00";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(150, 460); ctx.lineTo(96, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(280, 460); ctx.lineTo(330, 396); ctx.stroke();
    // legs
    rect(176, 560, 26, 70, "#8a6d00", 8);
    rect(228, 560, 26, 70, "#8a6d00", 8);
    // star burst between them
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = (i * Math.PI) / 5 - Math.PI / 2;
      var r = i % 2 === 0 ? 34 : 16;
      var x = 400 + Math.cos(a) * r;
      var y = 330 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // 3. Sun vs Cloud — a cheerful sun and a grumpy rain cloud.
  function drawSun() {
    skyAndGround("#a8d8ff", "#90be6d");
    // big sun (left)
    ctx.strokeStyle = "#ffb703";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    for (var i = 0; i < 12; i++) {
      var a = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(240 + Math.cos(a) * 120, 320 + Math.sin(a) * 120);
      ctx.lineTo(240 + Math.cos(a) * 152, 320 + Math.sin(a) * 152);
      ctx.stroke();
    }
    circle(240, 320, 104, "#ffd166");
    circle(240, 320, 88, "#ffcf3f");
    // sun face
    ctx.strokeStyle = "#1a1206";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(212, 306, 14, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(268, 306, 14, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(240, 330, 30, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    circle(212, 300, 5, "#1a1206");
    circle(268, 300, 5, "#1a1206");
    // grumpy cloud (right)
    ctx.fillStyle = "#8d99ae";
    circle(560, 300, 62, "#8d99ae");
    circle(620, 280, 76, "#8d99ae");
    circle(690, 300, 62, "#8d99ae");
    rect(500, 300, 250, 60, "#8d99ae", 26);
    // grumpy face
    ctx.strokeStyle = "#1a1206";
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(540, 310); ctx.lineTo(580, 322); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(680, 310); ctx.lineTo(640, 322); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(580, 350); ctx.lineTo(640, 350); ctx.stroke();
    // raindrops
    ctx.strokeStyle = "#4361ee";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    [[540, 400], [590, 420], [640, 400], [690, 420]].forEach(function (p) {
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0], p[1] + 26); ctx.stroke();
    });
    // grass + flowers
    rect(0, 560, W, 240, "#90be6d");
    circle(150, 650, 12, "#ef476f");
    circle(650, 690, 12, "#f78c6b");
    circle(400, 720, 12, "#ffd166");
    ctx.strokeStyle = "#2d6a4f";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(150, 662); ctx.lineTo(150, 700); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(650, 702); ctx.lineTo(650, 740); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(400, 732); ctx.lineTo(400, 770); ctx.stroke();
  }

  // 4. Mountain Climb — a tiny climber near the summit of a big mountain.
  function drawMountain() {
    skyAndGround("#cdb4db", "#90be6d");
    circle(640, 130, 44, "#ffd166");
    drawCloud(120, 110, 0.8);
    // far mountains
    triangle(0, 560, 260, 240, 520, 560, "#7f8c8d");
    triangle(300, 560, 560, 200, 800, 560, "#6c757d");
    // main mountain
    triangle(120, 560, 420, 160, 720, 560, "#5a6c7d");
    // snow cap
    triangle(370, 260, 420, 160, 470, 260, "#ffffff");
    triangle(388, 226, 420, 160, 452, 226, "#ffffff");
    // climbing route (dashed)
    ctx.strokeStyle = "#e63946";
    ctx.lineWidth = 5;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(180, 540);
    ctx.lineTo(300, 420);
    ctx.lineTo(380, 330);
    ctx.lineTo(430, 250);
    ctx.stroke();
    ctx.setLineDash([]);
    // flag at summit
    ctx.strokeStyle = "#1a1206";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(420, 160); ctx.lineTo(420, 96); ctx.stroke();
    triangle(420, 96, 420, 122, 470, 109, "#ef233c");
    // climber (small, near the route)
    var cx = 340, cy = 380;
    circle(cx, cy - 26, 14, "#ffd166"); // helmet
    ctx.strokeStyle = "#1a1206";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 18); ctx.stroke(); // body
    ctx.beginPath(); ctx.moveTo(cx, cy - 4); ctx.lineTo(cx - 20, cy - 18); ctx.stroke(); // arm up
    ctx.beginPath(); ctx.moveTo(cx, cy - 4); ctx.lineTo(cx + 18, cy + 4); ctx.stroke(); // arm
    ctx.beginPath(); ctx.moveTo(cx, cy + 18); ctx.lineTo(cx - 14, cy + 40); ctx.stroke(); // leg
    ctx.beginPath(); ctx.moveTo(cx, cy + 18); ctx.lineTo(cx + 16, cy + 38); ctx.stroke(); // leg
    // backpack
    rect(cx - 22, cy - 10, 14, 22, "#e76f51", 5);
    // ground
    rect(0, 560, W, 240, "#90be6d");
    circle(140, 660, 14, "#ef476f");
    circle(660, 700, 14, "#ffd166");
  }

  var TEMPLATES = {
    cat: drawCat,
    robots: drawRobots,
    sun: drawSun,
    mountain: drawMountain
  };

  /* ---------- Captions ---------- */

  function wrapText(text, maxWidth) {
    var words = text.split(/\s+/).filter(Boolean);
    var lines = [];
    var line = "";
    words.forEach(function (word) {
      var test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawCaption(text, y, fontSize) {
    if (!text.trim()) return;
    var maxWidth = W - 60;
    ctx.font = "900 " + fontSize + "px 'Arial Black', 'Bricolage Grotesque', Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var size = fontSize;
    var lines = wrapText(text.toUpperCase(), maxWidth);
    // Shrink until it fits (max 3 lines)
    while ((lines.length > 3 || (lines.length && ctx.measureText(lines[0]).width > maxWidth)) && size > 24) {
      size -= 4;
      ctx.font = "900 " + size + "px 'Arial Black', 'Bricolage Grotesque', Impact, sans-serif";
      lines = wrapText(text.toUpperCase(), maxWidth);
    }
    var lineHeight = size * 1.08;
    var startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach(function (lineText, i) {
      var ly = startY + i * lineHeight;
      ctx.lineWidth = Math.max(6, size / 7);
      ctx.strokeStyle = "#000000";
      ctx.lineJoin = "round";
      ctx.strokeText(lineText, W / 2, ly);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(lineText, W / 2, ly);
    });
  }

  /* ---------- Render ---------- */

  function render() {
    ctx.clearRect(0, 0, W, H);
    // white caption bands, scene in the middle
    rect(0, 0, W, H, "#ffffff");
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 130, W, 540);
    ctx.clip();
    ctx.translate(0, 130);
    ctx.scale(1, 540 / 670);
    TEMPLATES[currentTemplate]();
    ctx.restore();

    var fontSize = parseInt(fontSizeInput.value, 10);
    drawCaption(topInput.value, 65, fontSize);
    drawCaption(bottomInput.value, H - 65, fontSize);
    fontSizeLabel.textContent = "Text size: " + fontSize + "px";
  }

  /* ---------- Download ---------- */

  function downloadMeme() {
    canvas.toBlob(function (blob) {
      if (!blob) { showToast("Download failed — try again"); return; }
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "meme-" + currentTemplate + ".png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      showToast("Meme downloaded as PNG");
    }, "image/png");
  }

  /* ---------- Toast ---------- */

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* ---------- Wire up ---------- */

  document.getElementById("template-row").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-template]");
    if (!btn) return;
    currentTemplate = btn.getAttribute("data-template");
    document.querySelectorAll(".template-btn").forEach(function (b) {
      var active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
    render();
  });

  [topInput, bottomInput].forEach(function (input) {
    input.addEventListener("input", render);
  });
  fontSizeInput.addEventListener("input", render);

  downloadBtn.addEventListener("click", downloadMeme);

  randomBtn.addEventListener("click", function () {
    var pick = RANDOM_CAPTIONS[Math.floor(Math.random() * RANDOM_CAPTIONS.length)];
    topInput.value = pick[0];
    bottomInput.value = pick[1];
    render();
    showToast("Random caption loaded");
  });

  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  navToggle.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  render();
})();
