# Language Learning App

A Progressive Web App (PWA) for learning English and Spanish verb tenses through interactive multiple-choice questions.

## Features

- 📱 **PWA** - Install on mobile, works offline
- 🎯 **140 Questions** - 20 English + 120 Spanish (20 per tense)
- 🧠 **Smart Learning** - Detailed explanations for all answer options
- 🎨 **Clean UI** - Intuitive interface with progress tracking
- ⚡ **Fast** - Dynamic JSON loading, <100ms per file

## Question Sets

### English
- All verb tenses (20 questions)

### Spanish
- Presente del Indicativo (20 questions)
- Presente Perfecto (20 questions)
- Pretérito Indefinido (20 questions)
- Pretérito Imperfecto (20 questions)
- Imperativo (20 questions)
- Condicional (20 questions)

## Files

```
language_app/
├── index.html
├── styles.css
├── app.js
├── service-worker.js
├── manifest.json
├── questions_en.json
├── questions_es_presente.json
├── questions_es_perfecto.json
├── questions_es_indefinido.json
├── questions_es_imperfecto.json
├── questions_es_imperativo.json
└── questions_es_condicional.json
```

## Deploy to GitHub Pages

1. Upload all files to your repository
2. Go to Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / root
5. Save

## Local Development

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`

**Note**: Set `BASE_PATH = ""` in `service-worker.js` for local development

## Adding New Topics

### 1. Create JSON file
```json
[
  {
    "language": "es",
    "tense": "Futuro Simple",
    "sentence": "Mañana yo _______ al cine.",
    "options": ["voy", "fui", "iré", "iba"],
    "correct": 2,
    "explanations": [
      "'Voy' is present tense",
      "'Fui' is preterite tense",
      "Correct! 'Iré' is future tense",
      "'Iba' is imperfect tense"
    ]
  }
]
```

### 2. Update `app.js`
Add to `JSON_FILES` object:
```javascript
"Futuro Simple": "questions_es_futuro.json"
```

### 3. Update `service-worker.js`
Add to `STATIC_ASSETS` array:
```javascript
BASE_PATH + "/questions_es_futuro.json"
```

### 4. Update `index.html`
Add tense item:
```html
<div class="tense-item" data-tense="Futuro Simple">
  <span class="num">7</span>
  <span class="name">Futuro Simple</span>
</div>
```

### 5. Increment cache version
Update `CACHE_NAME` in `service-worker.js`

## Question Format

```json
{
  "language": "es" | "en",
  "tense": "Verb Tense Name",
  "sentence": "Sentence with _______",
  "options": ["A", "B", "C", "D"],
  "correct": 0-3,
  "explanations": ["Why A", "Why B", "Why C", "Why D"]
}
```

## License

MIT
