# Frontend

This folder contains all frontend UI files for the Ikshan application.

## Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ChatBotNew.jsx   # Main chatbot component
│   │   ├── ChatBotNew.css   # Chatbot styles
│   │   └── ErrorBoundary.jsx # Error handling component
│   ├── context/             # React context providers
│   │   └── ThemeContext.jsx # Theme context
│   ├── styles/              # Global styles
│   ├── App.jsx              # Root application component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global CSS
└── index.html               # HTML entry point
```

## Components

### ChatBotNew
The main chatbot interface component. Handles:
- User onboarding flow
- Domain/subdomain selection
- AI conversations
- Chat history management

### ErrorBoundary
React error boundary for graceful error handling.

### ThemeContext
Provides theming capabilities across the application.

## Development

```bash
# From project root
npm run dev
```

## Building

```bash
npm run build
```

## Notes

- Uses React with Vite
- Styled with CSS (no CSS-in-JS)
- Icons from Lucide React
- Markdown rendering with react-markdown
