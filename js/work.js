console.log("work.js loaded");
  // === FULLSCREEN CARD IMAGE FEATURE ===
  const overlay = document.getElementById('fullscreenOverlay');
  const overlayImg = document.getElementById('fullscreenImage');
  const closeBtn = overlay.querySelector('.close-fullscreen');

  document.querySelectorAll('.card img').forEach(img => {
    // Don’t expand center image
    if (img.id === "centerImage") return;

    // Billion Years Old card: open website
    if (img.src.includes("byo-logo.svg")) {
      img.addEventListener('click', e => {
        window.open("https://billionyearsold.com", "_blank", "noopener,noreferrer");
        e.preventDefault();
        e.stopPropagation();
      });
      return;
    }

    // Earth Unhacked card: open website
    if (img.src.includes("earth-unhacked")) {
      img.addEventListener('click', e => {
        window.open("https://x.com/GalacticMonk_/status/1916231264950210696", "_blank", "noopener,noreferrer");
        e.preventDefault();
        e.stopPropagation();
      });
      return;
    }
    // Fullscreen for everything else
    img.addEventListener('click', e => {
      overlayImg.src = img.src;
      overlayImg.alt = img.alt || '';
      overlay.style.display = 'flex';
      setTimeout(() => overlay.classList.add('active'), 5); // animate in
      document.body.style.overflow = 'hidden'; // prevent background scroll
    });
  });
  

// Close overlay (by button)
closeBtn.addEventListener('click', () => {
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.style.display = 'none';
    overlayImg.src = '';
    document.body.style.overflow = '';
  }, 200);
});

// Close overlay (by clicking outside image)
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeBtn.click();
});

// ESC to close
window.addEventListener('keydown', (e) => {
  if (overlay.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
    closeBtn.click();
  }
});

// === DEFINE ALL ELEMENTS ===
const gridContainer = document.getElementById("gridContainer");
const centerCard = document.getElementById("centerCard");
const centerImage = document.getElementById("centerImage");
const interactiveArea = document.getElementById("interactiveArea");
const logoContainer = document.getElementById("logoContainer");
const logoWrapper = document.querySelector(".logo-wrapper");
const logoChars = document.querySelectorAll(".logo .char");
const vChar = document.querySelector(".logo .v-char");
const sChar = document.querySelector(".logo .s-char");
const spacer = document.querySelector(".logo .spacer");

// === GSAP SETUP ===
CustomEase.create("customEase", "0.86,0,0.07,1");
const duration = 0.64;
const charDuration = 0.15;
const finalMergeDuration = 0.5;

// Create timelines
const expandTimeline = gsap.timeline({ paused: true });
const centerImageZoom = gsap.timeline({ paused: true });
const logoTimeline = gsap.timeline({ paused: true });

// === TIMELINE DEFINITIONS ===

// 1. Center Image Zoom Timeline
if (centerImage) {
  centerImageZoom.to(centerImage, {
    scale: 1.08,
    duration: duration,
    ease: "customEase",
  });
}

// 2. Logo Animation Timeline
const hideSequence = [13, 5, 12, 4, 11, 3, 10, 2, 9, 1, 8];
hideSequence.forEach((index, i) => {
  const char = document.querySelector(`.logo .char[data-index="${index}"]`);
  if (char) {
    logoTimeline.to(char, { opacity: 0, filter: "blur(8px)", duration: charDuration, ease: "customEase" }, i * 0.05);
  }
});

if (spacer) {
  logoTimeline.to(spacer, { opacity: 0, filter: "blur(8px)", duration: charDuration, ease: "customEase" }, hideSequence.length * 0.05);
}

if (sChar && vChar) {
  logoTimeline.to(sChar, { x: () => -(sChar.getBoundingClientRect().left - vChar.getBoundingClientRect().right), duration: finalMergeDuration, ease: "customEase" }, hideSequence.length * 0.05 + 0.05);
}

// 3. Grid Expansion Timeline
const cardPositions = {
  ".card-1": { top: 0, left: 0, xPercent: 0, yPercent: 0, delay: 0.05 },
  ".card-2": { top: 0, left: "50%", xPercent: -50, yPercent: 0, delay: 0.1 },
  ".card-3": { top: 0, left: "100%", xPercent: -100, yPercent: 0, delay: 0.15 },
  ".card-4": { top: "50%", left: 0, xPercent: 0, yPercent: -50, delay: 0.2 },
  ".card-6": { top: "50%", left: "100%", xPercent: -100, yPercent: -50, delay: 0.25 },
  ".card-7": { top: "100%", left: 0, xPercent: 0, yPercent: -100, delay: 0.3 },
  ".card-8": { top: "100%", left: "50%", xPercent: -50, yPercent: -100, delay: 0.35 },
  ".card-9": { top: "100%", left: "100%", xPercent: -100, yPercent: -100, delay: 0.4 },
};

for (const cardSelector in cardPositions) {
  expandTimeline.to(cardSelector, { ...cardPositions[cardSelector], opacity: 1, scale: 1, visibility: "visible", ease: "customEase", duration: duration }, 0);
}

// === EVENT HANDLING ===
let isExpanded = false;
let isHoveringGrid = false;

function expandGrid() {
  if (!isExpanded) {
    isExpanded = true;
    expandTimeline.play();
    centerImageZoom.play();
    logoTimeline.play();
  }
}

function collapseGrid() {
  if (isExpanded && !isHoveringGrid) {
    isExpanded = false;
    expandTimeline.reverse();
    centerImageZoom.reverse();
    logoTimeline.reverse();
  }
}

// Check if device supports hover
const supportsHover = window.matchMedia("(hover: hover)").matches;

if (supportsHover) {
  if (centerCard) centerCard.addEventListener("mouseenter", () => { isHoveringGrid = true; expandGrid(); });
  if (gridContainer) gridContainer.addEventListener("mouseenter", () => { isHoveringGrid = true; });
  if (gridContainer) gridContainer.addEventListener("mouseleave", () => { isHoveringGrid = false; setTimeout(collapseGrid, 50); });
} else {
  // Touch device logic
  if (centerCard) {
    centerCard.addEventListener("click", () => { isExpanded ? collapseGrid() : expandGrid(); });
    centerCard.style.opacity = 1;
    centerCard.style.visibility = "visible";
  }
}

// Recalculate logo animation on load/resize
function updateLogoAnimation() {
  if (!vChar || !sChar || logoTimeline.isActive()) return;
  const xPos = -(sChar.getBoundingClientRect().left - vChar.getBoundingClientRect().right);
  logoTimeline.getChildren().forEach(tween => {
    if (tween.targets()[0] === sChar) {
      tween.vars.x = xPos;
    }
  });
}

window.addEventListener("load", updateLogoAnimation);
window.addEventListener("resize", () => {
  if (isExpanded) {
    expandTimeline.invalidate().restart();
  }
  updateLogoAnimation();
});
  
  