# 🌐 Language App

A modern, offline-first Progressive Web App (PWA) for learning grammar across multiple languages.

## ✨ Features

- 🌍 **Multi-language Support**: Currently supports Spanish and US English
- 📚 **Comprehensive Grammar Practice**: Multiple verb tenses and grammar topics
- 💾 **Offline Functionality**: Works without an internet connection
- 📱 **Installable**: Can be installed on mobile and desktop devices
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- ⚡ **Fast & Lightweight**: Optimized performance with service workers

## 🎯 Supported Languages & Topics

### Spanish (Español)
- Presente del Indicativo
- Presente Perfecto
- Pretérito Indefinido
- Pretérito Imperfecto
- Imperativo
- Condicional
- Mixed mode (all tenses)

### US English
- Various grammar exercises

## 🚀 Getting Started

### Live Demo
Visit: [Your GitHub Pages URL]

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/language_app.git
   cd language_app
   ```

2. **Run a local server**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js:
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📱 Installing as PWA

### Desktop (Chrome/Edge/Brave)
1. Open the app in your browser
2. Look for the install icon in the address bar
3. Click "Install Language App"

### Mobile (iOS/Android)
1. Open in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"

## 🏗️ Project Structure

```
language_app/
├── index.html          # Main application page
├── app.js              # Core application logic
├── styles.css          # Styling and animations
├── questions.json      # Question database
├── service-worker.js   # PWA offline support
└── manifest.json       # PWA configuration
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No frameworks, pure JS
- **Service Workers**: Offline functionality
- **Web App Manifest**: PWA capabilities

## 📖 How It Works

1. **Language Selection**: Choose your target language
2. **Topic/Tense Selection**: Pick what you want to practice
3. **Interactive Exercises**: Fill-in-the-blank questions with instant feedback
4. **Progress Tracking**: Visual progress bar shows your advancement

## 🌟 Features in Detail

### Offline Support
The app uses service workers to cache all resources, allowing you to practice even without an internet connection.

### Progressive Enhancement
Works on all modern browsers with graceful degradation for older ones.

### Responsive Design
Optimized for all screen sizes from mobile phones to desktop monitors.

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- High contrast text and colors

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions
- Add more languages
- Add more grammar topics
- Improve UI/UX
- Add statistics/progress tracking
- Add spaced repetition algorithm
- Add audio pronunciation

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web standards
- Icons: Unicode emoji
- Inspired by the need for accessible language learning tools

## 📧 Contact

Project Link: [https://github.com/YOUR_USERNAME/language_app](https://github.com/YOUR_USERNAME/language_app)

---

**Happy Learning! 🎓**
