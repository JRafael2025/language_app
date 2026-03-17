// ============================================================
// Language App – Main JavaScript
// Offline-first grammar learning PWA
// ============================================================

// --- Global State ---
let selectedLanguage = null;
let selectedTense = null;
let currentTipData = null; // Stores the current tip structure
let currentTipIndex = 0;   // Which tip we're on
let currentQuestionIndex = 0; // Which question within the current tip
let showingTip = true;     // Whether we're showing a tip or a question
let questionPool = [];
let correctCount = 0;
let totalAnswered = 0;

// --- I18n (internationalization) ---
const i18n = {
  en: {
    langTitle: "Pick a language",
    langSub: "Choose what you want to practice today",
    tenseTitle: "Choose a tense",
    tenseSub: "Pick one or mix them all",
    nextBtn: "Next question →",
    restartBtn: "← Back to start",
    correctFeedback: "✓ Correct!",
    wrongFeedback: "✗ Incorrect",
    installText: "Add Language App to your home screen<br/>for an offline experience.",
    tipTitle: "TIP"
  },
  es: {
    langTitle: "Elige un idioma",
    langSub: "Selecciona lo que quieres practicar hoy",
    tenseTitle: "Elige un tiempo verbal",
    tenseSub: "Escoge uno o mézclalos todos",
    nextBtn: "Siguiente pregunta →",
    restartBtn: "← Volver al inicio",
    correctFeedback: "✓ ¡Correcto!",
    wrongFeedback: "✗ Incorrecto",
    installText: "Añade Language App a tu pantalla de inicio<br/>para una experiencia sin conexión.",
    tipTitle: "DICA"
  }
};

// --- UI Elements ---
const screens = {
  lang: document.getElementById("screen-lang"),
  tense: document.getElementById("screen-tense"),
  tips: document.getElementById("screen-tips"),
  exercise: document.getElementById("screen-exercise")
};

const exerciseElements = {
  progressFill: document.getElementById("progress-fill"),
  badge: document.getElementById("q-badge"),
  sentence: document.getElementById("q-sentence"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  fbHead: document.getElementById("fb-head"),
  fbText: document.getElementById("fb-text"),
  nextBtn: document.getElementById("next-btn"),
  prevBtn: document.getElementById("prev-btn"),
  restartBtn: document.getElementById("restart-btn")
};

// --- Screen Navigation ---
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screenName].classList.add("active");
}

// --- Apply I18n ---
function applyI18n(lang) {
  const t = i18n[lang] || i18n.en;
  document.getElementById("lang-title").textContent = t.langTitle;
  document.getElementById("lang-sub").textContent = t.langSub;
  document.getElementById("tense-title").textContent = t.tenseTitle;
  document.getElementById("tense-sub").textContent = t.tenseSub;
  document.getElementById("install-banner-text").innerHTML = t.installText;
  exerciseElements.nextBtn.textContent = t.nextBtn;
  exerciseElements.restartBtn.textContent = t.restartBtn;
}

// --- Language Selection (Screen 1) ---
document.querySelectorAll(".lang-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedLanguage = card.dataset.lang;
    applyI18n(selectedLanguage);

    if (selectedLanguage === "es") {
      showScreen("tense");
    } else {
      // For English, load questions directly
      loadQuestions("en", "English Grammar");
    }
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

// --- Tense Selection (Screen 2) ---
document.querySelectorAll("#tense-list .tense-item").forEach(item => {
  item.addEventListener("click", () => {
    selectedTense = item.dataset.tense;
    
    // Check if this is the "Ver Dicas" button
    if (selectedTense === "Dicas") {
      showScreen("tips");
    } else {
      loadQuestions(selectedLanguage, selectedTense);
    }
  });
});

// --- Tips Selection (Screen 2.5) ---
document.querySelectorAll("#tips-list .tense-item").forEach(item => {
  item.addEventListener("click", () => {
    const tipTense = item.dataset.tipTense;
    loadTipsOnly(selectedLanguage, tipTense);
  });
});

document.getElementById("back-btn-tips").addEventListener("click", () => {
  showScreen("tense");
});

document.getElementById("back-btn-tense").addEventListener("click", () => {
  showScreen("lang");
  selectedLanguage = null;
  selectedTense = null;
});

// --- Load Tips Only ---
async function loadTipsOnly(lang, tense) {
  try {
    if (lang !== "es") return;
    
    let allTips = [];
    
    if (tense === "Todos") {
      // Load all tips from all tenses
      const files = [
        { file: "questions_es_presente.json", name: "Presente del Indicativo" },
        { file: "questions_es_perfecto.json", name: "Presente Perfecto" },
        { file: "questions_es_indefinido.json", name: "Pretérito Indefinido" },
        { file: "questions_es_imperfecto.json", name: "Pretérito Imperfecto" },
        { file: "questions_es_imperativo.json", name: "Imperativo" },
        { file: "questions_es_condicional.json", name: "Condicional" }
      ];
      
      for (const { file, name } of files) {
        const response = await fetch(file);
        const json = await response.json();
        
        if (json.tips) {
          json.tips.forEach(tip => {
            allTips.push({
              ...tip,
              tenseName: name
            });
          });
        }
      }
    } else {
      // Load tips from specific tense
      const tenseFileMap = {
        "Presente del Indicativo": "questions_es_presente.json",
        "Presente Perfecto": "questions_es_perfecto.json",
        "Pretérito Indefinido": "questions_es_indefinido.json",
        "Pretérito Imperfecto": "questions_es_imperfecto.json",
        "Imperativo": "questions_es_imperativo.json",
        "Condicional": "questions_es_condicional.json"
      };
      
      const response = await fetch(tenseFileMap[tense]);
      const json = await response.json();
      
      if (json.tips) {
        json.tips.forEach(tip => {
          allTips.push({
            ...tip,
            tenseName: tense
          });
        });
      }
    }
    
    // Create a special structure for tips-only mode
    currentTipData = {
      tense: tense === "Todos" ? "Dicas de Todos os Tempos" : `Dicas - ${tense}`,
      tips: allTips,
      tipsOnlyMode: true
    };
    currentTipIndex = 0;
    currentQuestionIndex = 0;
    showingTip = true;
    correctCount = 0;
    totalAnswered = 0;

    showScreen("exercise");
    renderTip();
  } catch (error) {
    console.error("Error loading tips:", error);
    alert("Error loading tips. Please try again.");
  }
}

// --- Load Questions ---
async function loadQuestions(lang, tense) {
  try {
    let data;
    
    if (lang === "en") {
      const response = await fetch("questions_en.json");
      data = await response.json();
      questionPool = data;
      currentTipData = null;
      showingTip = false;
    } else if (lang === "es") {
      if (tense === "Presente del Indicativo") {
        // Load the new tip-based structure
        const response = await fetch("questions_es_presente.json");
        data = await response.json();
        currentTipData = data;
        currentTipIndex = 0;
        currentQuestionIndex = 0;
        showingTip = true;
      } else if (tense === "Todos") {
        // Load dedicated mixed-tense questions file
        const response = await fetch("questions_es_todos.json");
        const json = await response.json();
        
        const allQuestions = json.questions.map(q => ({
          ...q,
          language: "es",
          tense: json.tense
        }));
        
        questionPool = shuffleArray(allQuestions);
        currentTipData = null;
        showingTip = false;
      } else if (tense === "Presente Perfecto") {
        // Load the new tip-based structure for Presente Perfecto
        const response = await fetch("questions_es_perfecto.json");
        data = await response.json();
        currentTipData = data;
        currentTipIndex = 0;
        currentQuestionIndex = 0;
        showingTip = true;
      } else if (tense === "Pretérito Indefinido") {
        // Load the new tip-based structure for Pretérito Indefinido
        const response = await fetch("questions_es_indefinido.json");
        data = await response.json();
        currentTipData = data;
        currentTipIndex = 0;
        currentQuestionIndex = 0;
        showingTip = true;
      } else if (tense === "Pretérito Imperfecto") {
        // Load the new tip-based structure for Pretérito Imperfecto
        const response = await fetch("questions_es_imperfecto.json");
        data = await response.json();
        currentTipData = data;
        currentTipIndex = 0;
        currentQuestionIndex = 0;
        showingTip = true;
      } else if (tense === "Imperativo") {
        // Load the new tip-based structure for Imperativo
        const response = await fetch("questions_es_imperativo.json");
        data = await response.json();
        currentTipData = data;
        currentTipIndex = 0;
        currentQuestionIndex = 0;
        showingTip = true;
      } else if (tense === "Condicional") {
        // Load the new tip-based structure for Condicional
        const response = await fetch("questions_es_condicional.json");
        data = await response.json();
        currentTipData = data;
        currentTipIndex = 0;
        currentQuestionIndex = 0;
        showingTip = true;
      }
    }

    correctCount = 0;
    totalAnswered = 0;

    showScreen("exercise");
    
    if (showingTip) {
      renderTip();
    } else {
      renderQuestion();
    }
  } catch (error) {
    console.error("Error loading questions:", error);
    alert("Error loading questions. Please try again.");
  }
}

// --- Render Tip Screen ---
function renderTip() {
  const tip = currentTipData.tips[currentTipIndex];
  const t = i18n[selectedLanguage] || i18n.en;
  
  // Update progress bar
  const totalTips = currentTipData.tips.length;
  const progressPercent = (currentTipIndex / totalTips) * 100;
  exerciseElements.progressFill.style.width = `${progressPercent}%`;
  
  // Set badge - show tense name if in tips-only mode
  if (currentTipData.tipsOnlyMode) {
    exerciseElements.badge.textContent = `${tip.tenseName} - ${t.tipTitle} ${tip.id}`;
  } else {
    exerciseElements.badge.textContent = `${t.tipTitle} ${tip.id}`;
  }
  
  // Set tip content
  exerciseElements.sentence.innerHTML = `
    <div style="margin-bottom: 16px;">
      <strong style="font-size: 1.2rem; color: var(--accent);">${tip.title}</strong>
    </div>
    <div style="line-height: 1.8; white-space: pre-line;">
      ${tip.content}
    </div>
  `;
  
  // Hide options and feedback
  exerciseElements.options.innerHTML = "";
  exerciseElements.feedback.classList.remove("show");
  
  // Show/hide previous button in tips-only mode
  if (currentTipData.tipsOnlyMode) {
    if (currentTipIndex > 0) {
      exerciseElements.prevBtn.style.display = "block";
    } else {
      exerciseElements.prevBtn.style.display = "none";
    }
  } else {
    exerciseElements.prevBtn.style.display = "none";
  }
  
  // Show next button
  exerciseElements.nextBtn.classList.add("show");
  
  // Change button text based on mode
  if (currentTipData.tipsOnlyMode) {
    // In tips-only mode, check if this is the last tip
    if (currentTipIndex >= totalTips - 1) {
      exerciseElements.nextBtn.textContent = "← Volver arriba";
    } else {
      exerciseElements.nextBtn.textContent = "Próxima dica →";
    }
  } else {
    exerciseElements.nextBtn.textContent = "Começar exercícios →";
  }
}

// --- Render Question ---
function renderQuestion() {
  let currentQuestion;
  
  if (currentTipData && !showingTip) {
    // Get question from current tip
    const tip = currentTipData.tips[currentTipIndex];
    currentQuestion = tip.questions[currentQuestionIndex];
    
    // Update progress bar
    const totalQuestions = currentTipData.tips.reduce((sum, t) => sum + t.questions.length, 0);
    const questionsAnswered = currentTipData.tips.slice(0, currentTipIndex).reduce((sum, t) => sum + t.questions.length, 0) + currentQuestionIndex;
    const progressPercent = (questionsAnswered / totalQuestions) * 100;
    exerciseElements.progressFill.style.width = `${progressPercent}%`;
    
    // Set badge
    exerciseElements.badge.textContent = currentTipData.tense;
  } else {
    // Old format - single question pool
    if (totalAnswered >= questionPool.length) {
      showFinalScore();
      return;
    }
    
    currentQuestion = questionPool[totalAnswered];
    
    // Update progress bar
    const progressPercent = ((totalAnswered + 1) / questionPool.length) * 100;
    exerciseElements.progressFill.style.width = `${progressPercent}%`;
    
    // Set badge
    exerciseElements.badge.textContent = currentQuestion.tense || "Question";
  }
  
  // Render sentence with blank
  const sentenceWithBlank = currentQuestion.sentence.replace(/_+/g, '<span class="blank"></span>');
  exerciseElements.sentence.innerHTML = sentenceWithBlank;
  
  // Render options
  exerciseElements.options.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  
  currentQuestion.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <span class="opt-letter">${letters[index]}</span>
      <span>${option}</span>
    `;
    btn.addEventListener("click", () => handleAnswer(index, currentQuestion));
    exerciseElements.options.appendChild(btn);
  });
  
  // Reset feedback and next button
  exerciseElements.feedback.classList.remove("show", "correct-fb", "wrong-fb");
  exerciseElements.nextBtn.classList.remove("show");
}

// --- Handle Answer ---
function handleAnswer(selectedIndex, question) {
  const t = i18n[selectedLanguage] || i18n.en;
  const optionBtns = exerciseElements.options.querySelectorAll(".option-btn");
  const isCorrect = selectedIndex === question.correct;
  
  // Disable all buttons
  optionBtns.forEach(btn => btn.disabled = true);
  
  // Mark correct and wrong answers
  optionBtns[question.correct].classList.add("correct");
  if (!isCorrect) {
    optionBtns[selectedIndex].classList.add("wrong");
  }
  
  // Update score
  totalAnswered++;
  if (isCorrect) {
    correctCount++;
  }
  
  // Show feedback
  exerciseElements.feedback.classList.add("show");
  exerciseElements.feedback.classList.add(isCorrect ? "correct-fb" : "wrong-fb");
  exerciseElements.fbHead.textContent = isCorrect ? t.correctFeedback : t.wrongFeedback;
  
  // Build feedback text
  let feedbackHTML = "";
  
  // Show explanation for selected answer
  if (question.explanations && question.explanations[selectedIndex]) {
    feedbackHTML += `<div class="chosen-explanation">${question.explanations[selectedIndex]}</div>`;
  }
  
  // Show all explanations
  if (question.explanations && question.explanations.length > 1) {
    feedbackHTML += '<div class="all-explanations-divider"></div>';
    feedbackHTML += '<div class="all-explanations">';
    
    question.options.forEach((option, idx) => {
      const isThisCorrect = idx === question.correct;
      const isThisSelected = idx === selectedIndex;
      const expClass = isThisCorrect ? "correct-option" : "wrong-option";
      
      if (!isThisSelected && question.explanations[idx]) {
        const marker = isThisCorrect ? "✓" : "✗";
        feedbackHTML += `
          <div class="explanation-item ${expClass}">
            <span class="exp-marker">${marker}</span>
            <strong>${option}:</strong> ${question.explanations[idx]}
          </div>
        `;
      }
    });
    
    feedbackHTML += '</div>';
  }
  
  exerciseElements.fbText.innerHTML = feedbackHTML;
  
  // Show next button
  exerciseElements.nextBtn.classList.add("show");
  exerciseElements.nextBtn.textContent = t.nextBtn;
}

// --- Next Button Handler ---
exerciseElements.nextBtn.addEventListener("click", () => {
  if (currentTipData) {
    // Tip-based flow
    if (showingTip) {
      // Check if we're in tips-only mode
      if (currentTipData.tipsOnlyMode) {
        // In tips-only mode, just navigate between tips
        currentTipIndex++;
        
        if (currentTipIndex >= currentTipData.tips.length) {
          // Finished all tips - go back to start
          showScreen("lang");
          selectedLanguage = null;
          selectedTense = null;
          currentTipData = null;
          currentTipIndex = 0;
          currentQuestionIndex = 0;
          showingTip = false;
          questionPool = [];
          correctCount = 0;
          totalAnswered = 0;
        } else {
          // Show next tip
          renderTip();
        }
      } else {
        // Normal mode: moving from tip to questions
        showingTip = false;
        currentQuestionIndex = 0;
        renderQuestion();
      }
    } else {
      // Moving to next question or tip
      currentQuestionIndex++;
      
      const currentTip = currentTipData.tips[currentTipIndex];
      if (currentQuestionIndex >= currentTip.questions.length) {
        // Finished all questions for this tip
        currentTipIndex++;
        
        if (currentTipIndex >= currentTipData.tips.length) {
          // Finished all tips
          showFinalScore();
        } else {
          // Show next tip
          showingTip = true;
          currentQuestionIndex = 0;
          renderTip();
        }
      } else {
        // Show next question in current tip
        renderQuestion();
      }
    }
  } else {
    // Old format - linear question flow
    if (totalAnswered >= questionPool.length) {
      showFinalScore();
    } else {
      renderQuestion();
    }
  }
});

// --- Previous Button Handler (for tips-only mode) ---
exerciseElements.prevBtn.addEventListener("click", () => {
  if (currentTipData && currentTipData.tipsOnlyMode && showingTip) {
    if (currentTipIndex > 0) {
      currentTipIndex--;
      renderTip();
    }
  }
});

// --- Restart Button ---
exerciseElements.restartBtn.addEventListener("click", () => {
  showScreen("lang");
  selectedLanguage = null;
  selectedTense = null;
  currentTipData = null;
  currentTipIndex = 0;
  currentQuestionIndex = 0;
  showingTip = false;
  questionPool = [];
  correctCount = 0;
  totalAnswered = 0;
});

// --- Final Score ---
function showFinalScore() {
  const percentage = Math.round((correctCount / totalAnswered) * 100);
  
  exerciseElements.badge.textContent = "Finished!";
  exerciseElements.sentence.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 16px;">🎉</div>
      <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">
        ${correctCount} / ${totalAnswered}
      </div>
      <div style="font-size: 1.2rem; color: var(--text-secondary);">
        ${percentage}% correct
      </div>
    </div>
  `;
  
  exerciseElements.options.innerHTML = "";
  exerciseElements.feedback.classList.remove("show");
  exerciseElements.nextBtn.classList.remove("show");
  exerciseElements.progressFill.style.width = "100%";
}

// --- Utility Functions ---
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// --- PWA Install Banner ---
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("install-banner").classList.add("show");
});

document.getElementById("install-btn").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === "accepted") {
    document.getElementById("install-banner").classList.remove("show");
  }
  
  deferredPrompt = null;
});

// --- Service Worker Registration ---
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(() => {
    console.log("Service Worker registered successfully.");
  }).catch((error) => {
    console.error("Service Worker registration failed:", error);
  });
}
