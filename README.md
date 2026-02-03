# Language App - Estrutura Atualizada v5

## 📁 Nova Estrutura de Arquivos

A aplicação agora usa **arquivos JSON separados** para cada tópico de estudo, melhorando:
- ✅ **Qualidade**: Questões curadas manualmente, sem repetições
- ✅ **Organização**: Fácil manutenção e atualização
- ✅ **Performance**: Carrega apenas o necessário
- ✅ **Escalabilidade**: Adicione novos tópicos facilmente

## 📚 Arquivos JSON

### Inglês
- `questions_en.json` - Todos os tempos verbais do inglês (20 questões)

### Espanhol
- `questions_es_presente.json` - Presente del Indicativo (20 questões)
- `questions_es_perfecto.json` - Presente Perfecto (20 questões)
- `questions_es_indefinido.json` - Pretérito Indefinido (20 questões)
- `questions_es_imperfecto.json` - Pretérito Imperfecto (20 questões)
- `questions_es_imperativo.json` - Imperativo (20 questões)
- `questions_es_condicional.json` - Condicional (20 questões)

## 🎯 Melhorias Implementadas

### Problemas Resolvidos
1. ❌ **Opção D muito repetida** → Agora cada questão tem opções únicas e variadas
2. ❌ **Resposta visível na frase** → Sentenças reescritas para não dar pistas
3. ❌ **Construções erradas** → Todas as frases revisadas para gramática correta
4. ❌ **JSON muito grande** → Dividido em 7 arquivos menores e gerenciáveis

### Qualidade das Questões
- ✅ Explicações detalhadas para TODAS as opções
- ✅ Opções distratoras realistas e educativas
- ✅ Sem repetições dentro de cada conjunto
- ✅ Progressão lógica de dificuldade

## 🔧 Como Funciona

### Carregamento Dinâmico
O `app.js` agora:
1. Detecta o idioma e tópico escolhido
2. Carrega apenas o(s) JSON(s) necessário(s)
3. Para "Todos" em espanhol, carrega e mistura os 6 tempos verbais
4. Mantém as questões embaralhadas em memória

### Mapeamento de Arquivos
```javascript
const JSON_FILES = {
  en: "questions_en.json",
  "Presente del Indicativo": "questions_es_presente.json",
  "Presente Perfecto": "questions_es_perfecto.json",
  "Pretérito Indefinido": "questions_es_indefinido.json",
  "Pretérito Imperfecto": "questions_es_imperfecto.json",
  "Imperativo": "questions_es_imperativo.json",
  "Condicional": "questions_es_condicional.json"
};
```

## 📦 Deploy

### GitHub Pages
1. Crie um repositório chamado `language_app`
2. Faça upload de TODOS os arquivos:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `service-worker.js`
   - `manifest.json`
   - `questions_en.json`
   - `questions_es_*.json` (todos os 6 arquivos)

3. Configure GitHub Pages:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / root

### Desenvolvimento Local
```bash
# Na pasta do projeto
python -m http.server 8000

# Acesse
http://localhost:8000
```

**Importante**: Para dev local, edite `service-worker.js`:
```javascript
const BASE_PATH = ""; // vazio para localhost
```

## 🆕 Como Adicionar Novos Tópicos

### 1. Crie um novo arquivo JSON
```json
[
  {
    "language": "es",
    "tense": "Futuro Simple",
    "sentence": "Mañana yo _______ al cine.",
    "options": [
      "voy",
      "fui",
      "iré",
      "iba"
    ],
    "correct": 2,
    "explanations": [
      "'Voy' es presente...",
      "'Fui' es pretérito...",
      "Correcto! 'Iré' es futuro...",
      "'Iba' es imperfecto..."
    ]
  }
]
```

### 2. Atualize o app.js
```javascript
const JSON_FILES = {
  // ... arquivos existentes ...
  "Futuro Simple": "questions_es_futuro.json"
};
```

### 3. Atualize o service-worker.js
```javascript
const STATIC_ASSETS = [
  // ... arquivos existentes ...
  BASE_PATH + "/questions_es_futuro.json"
];
```

### 4. Atualize o index.html
Adicione novo item na lista de tempos:
```html
<div class="tense-item" data-tense="Futuro Simple">
  <span class="num">7</span>
  <span class="name">Futuro Simple</span>
</div>
```

## 🎨 Estrutura das Questões

Cada questão segue este formato:
```json
{
  "language": "es" | "en",
  "tense": "Nome do Tempo Verbal",
  "sentence": "Frase com _______",
  "options": ["opção A", "opção B", "opção C", "opção D"],
  "correct": 0-3,
  "explanations": [
    "Explicação da opção A",
    "Explicação da opção B", 
    "Explicação da opção C",
    "Explicação da opção D"
  ]
}
```

## 📱 PWA Features

A aplicação continua funcionando como PWA:
- ✅ Instalável no celular
- ✅ Funciona offline
- ✅ Cache inteligente
- ✅ Ícone na home screen

## 🔄 Versões

- **v1-v3**: JSON único grande
- **v4**: Melhorias no feedback
- **v5**: JSONs separados por tópico (atual)

## 📊 Estatísticas

- **Total de questões**: 140
  - Inglês: 20
  - Espanhol: 120 (20 por tempo verbal)
- **Arquivos JSON**: 7
- **Tamanho médio por arquivo**: ~15-20KB
- **Tempo de carregamento**: <100ms por arquivo

## 🤝 Contribuindo

Para adicionar mais questões:
1. Edite o arquivo JSON correspondente
2. Mantenha o formato existente
3. Teste localmente antes de fazer deploy
4. Incremente o CACHE_NAME no service-worker.js

---

**Desenvolvido com ❤️ para aprendizado de idiomas**
