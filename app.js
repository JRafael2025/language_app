/* ============================================================
   Language App – app.js  (v4)
   Changes from v1:
     • i18n: all user-facing strings switch on selectedLang
     • Feedback shows the explanation for the TAPPED option, not just correct
     • Session no-repeat: pool is walked linearly; reshuffle only on exhaust
   ============================================================ */

// ============================================================
// i18n dictionary – every user-facing string lives here
// ============================================================
const i18n = {
  es: {
    pickLang:      "Elige un idioma",
    pickLangSub:   "Selecciona lo que quieres practicar hoy",
    chooseTense:   "Elige un tiempo verbal",
    chooseTenseSub:"Escoge uno o mézclalo todo",
    back:          "← Atrás",
    backToStart:   "← Volver al inicio",
    correct:       "✓ ¡Correcto!",
    wrong:         "✗ No del todo",
    next:          "Siguiente →",
    badgeAll:      "Español – Todos los tiempos",
    badgeTense:    (t) => `Español – ${t}`,
    badgeEn:       "Inglés (EE.UU.)",   // fallback, shouldn't show
    installTitle:  "Añade Language App a tu pantalla de inicio\npara una experiencia offline.",
    installBtn:    "⬇ Instalar app"
  },
  en: {
    pickLang:      "Pick a language",
    pickLangSub:   "Choose what you want to practice today",
    chooseTense:   "Choose a tense",
    chooseTenseSub:"Pick one or mix them all",
    back:          "← Back",
    backToStart:   "← Back to start",
    correct:       "✓ Correct!",
    wrong:         "✗ Not quite",
    next:          "Next question →",
    badgeAll:      "Spanish – All Tenses",
    badgeTense:    (t) => `Spanish – ${t}`,
    badgeEn:       "US English",
    installTitle:  "Add Language App to your home screen\nfor an offline experience.",
    installBtn:    "⬇ Install App"
  }
};

// Helper: grab current dictionary (defaults to English before selection)
function t() { return i18n[selectedLang] || i18n.en; }

// ============================================================
// DOM references
// ============================================================
const screens = {
  lang:     document.getElementById("screen-lang"),
  tense:    document.getElementById("screen-tense"),
  exercise: document.getElementById("screen-exercise")
};

const els = {
  // Lang screen (text nodes we update)
  langTitle:     document.getElementById("lang-title"),
  langSub:       document.getElementById("lang-sub"),
  // Tense screen
  tenseTitle:    document.getElementById("tense-title"),
  tenseSub:      document.getElementById("tense-sub"),
  backBtnTense:  document.getElementById("back-btn-tense"),
  // Exercise screen
  badge:         document.getElementById("q-badge"),
  sentence:      document.getElementById("q-sentence"),
  optionsWrap:   document.getElementById("options"),
  feedback:      document.getElementById("feedback"),
  fbHead:        document.getElementById("fb-head"),
  fbText:        document.getElementById("fb-text"),
  nextBtn:       document.getElementById("next-btn"),
  restartBtn:    document.getElementById("restart-btn"),
  progressBar:   document.getElementById("progress-fill"),
  // Install
  installBanner: document.getElementById("install-banner"),
  installBannerText: document.getElementById("install-banner-text"),
  installBtn:    document.getElementById("install-btn")
};

// ============================================================
// App State
// ============================================================
let allQuestions   = [];   // full dataset
let pool           = [];   // filtered & shuffled for this session
let poolIndex      = 0;    // linear cursor – never skip, never repeat in session
let selectedLang   = null; // "es" | "en"
let selectedTense  = null; // tense string | "Todos" | null
let deferredPrompt = null; // PWA install prompt

// ============================================================
// Utility: Fisher-Yates shuffle (in-place)
// ============================================================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================
// Screen navigation
// ============================================================
function showScreen(id) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[id].classList.add("active");
}

// ============================================================
// Apply i18n strings to all static UI elements for current lang
// ============================================================
function applyI18n() {
  const d = t();
  els.langTitle.textContent      = d.pickLang;
  els.langSub.textContent        = d.pickLangSub;
  els.tenseTitle.textContent     = d.chooseTense;
  els.tenseSub.textContent       = d.chooseTenseSub;
  els.backBtnTense.textContent   = d.back;
  els.nextBtn.textContent        = d.next;
  els.restartBtn.textContent     = d.backToStart;
  els.installBannerText.textContent = d.installTitle;
  els.installBtn.textContent     = d.installBtn;
}

// ============================================================
// INIT
// ============================================================
async function init() {
  // 1. Load questions
  try {
    const res = await fetch("./questions.json");
    allQuestions = await res.json();
  } catch (e) {
    console.error("[Language App] Failed to load questions.json", e);
  }

  // 2. Language cards
  document.querySelectorAll(".lang-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedLang = card.dataset.lang;
      applyI18n(); // update all strings before showing next screen

      if (selectedLang === "es") {
        showScreen("tense");
      } else {
        selectedTense = null;
        buildPool();
        showScreen("exercise");
      }
    });
  });

  // 3. Back button (tense screen)
  els.backBtnTense.addEventListener("click", () => showScreen("lang"));

  // 4. Tense items
  document.querySelectorAll(".tense-item").forEach(item => {
    item.addEventListener("click", () => {
      selectedTense = item.dataset.tense;
      buildPool();
      showScreen("exercise");
    });
  });

  // 5. Next button – advance cursor; reshuffle only when pool is exhausted
  els.nextBtn.addEventListener("click", () => {
    poolIndex++;
    if (poolIndex >= pool.length) {
      // Session complete – reshuffle for a fresh round
      shuffle(pool);
      poolIndex = 0;
    }
    renderQuestion();
  });

  // 6. Restart → back to language screen
  els.restartBtn.addEventListener("click", () => showScreen("lang"));

  // 7. PWA install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    els.installBanner.classList.add("show");
  });
  els.installBtn.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        els.installBanner.classList.remove("show");
      });
    }
  });

  // 8. Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("[SW] Registered"))
      .catch((e) => console.warn("[SW] Registration failed", e));
  }

  showScreen("lang");
}

// ============================================================
// BUILD POOL – filter, shuffle, reset cursor
// ============================================================
function buildPool() {
  let filtered = allQuestions.filter(q => q.language === selectedLang);

  if (selectedLang === "es" && selectedTense && selectedTense !== "Todos") {
    filtered = filtered.filter(q => q.tense === selectedTense);
  }

  // Fresh shuffle – every question in the filtered set appears exactly once
  // before any question can repeat (linear walk)
  pool      = shuffle([...filtered]);
  poolIndex = 0;
  renderQuestion();
}

// ============================================================
// RENDER QUESTION
// ============================================================
function renderQuestion() {
  const q = pool[poolIndex];
  if (!q) return;

  const d = t();

  // Badge
  if (selectedLang === "en") {
    els.badge.textContent = d.badgeEn;
  } else {
    els.badge.textContent = selectedTense === "Todos"
      ? d.badgeAll
      : d.badgeTense(q.tense);
  }

  // Sentence – replace _______ with styled blank
  els.sentence.innerHTML = q.sentence.replace(
    "_______",
    '<span class="blank"></span>'
  );

  // Progress bar (position within current pool round)
  els.progressBar.style.width = ((poolIndex + 1) / pool.length * 100) + "%";

  // Options
  els.optionsWrap.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  q.options.forEach((opt, i) => {
    const btn       = document.createElement("button");
    btn.className   = "option-btn";
    btn.innerHTML   = `<span class="opt-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener("click", () => handleAnswer(i, q));
    els.optionsWrap.appendChild(btn);
  });

  // Reset feedback & next btn
  els.feedback.className = "feedback";
  els.feedback.classList.remove("show");
  els.nextBtn.classList.remove("show");
}

// ============================================================
// HANDLE ANSWER
// ============================================================
function handleAnswer(chosen, q) {
  const d    = t();
  const btns = els.optionsWrap.querySelectorAll(".option-btn");

  // Lock all options
  btns.forEach(b => b.disabled = true);

  const isCorrect = chosen === q.correct;

  // Style the tapped option
  btns[chosen].classList.add(isCorrect ? "correct" : "wrong");

  // If wrong, also reveal the correct answer
  if (!isCorrect) {
    btns[q.correct].classList.add("correct");
  }

  // Feedback – always show the explanation for the CHOSEN option
  els.fbHead.textContent = isCorrect ? d.correct : d.wrong;
  els.fbText.textContent = q.explanations[chosen];
  els.feedback.className = "feedback " + (isCorrect ? "correct-fb" : "wrong-fb") + " show";

  // Reveal Next button
  els.nextBtn.classList.add("show");
}

// --- Go ---
init();
