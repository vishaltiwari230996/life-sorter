import ChatBotNew from './components/ChatBotNew';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="app">
          <ChatBotNew />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
