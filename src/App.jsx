import { useState, useRef } from 'react';
import { LayoutGrid, MessageSquare, Package } from 'lucide-react';
import ChatBot from './components/ChatBot';
import ChatBotHorizontal from './components/ChatBotHorizontal';
import ProductSection from './components/ProductSection';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const [viewMode, setViewMode] = useState('vertical'); // 'vertical' | 'horizontal'
  const [showProducts, setShowProducts] = useState(false);
  const productsRef = useRef(null);

  const handleProductsClick = () => {
    if (viewMode === 'vertical') {
      // Scroll to products section
      productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Toggle products modal/overlay in horizontal mode
      setShowProducts(!showProducts);
    }
  };

  return (
    <div className="app">
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
        <div className="particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${Math.random() * 20}s`,
              '--duration': `${15 + Math.random() * 20}s`,
              '--x-start': `${Math.random() * 100}%`,
              '--x-end': `${Math.random() * 100}%`,
              '--size': `${2 + Math.random() * 4}px`,
              '--opacity': Math.random() * 0.5 + 0.2
            }}></div>
          ))}
        </div>
        <div className="grid-overlay"></div>
      </div>
      
      <header className="app-header">
        <div className="logo">
          <img src="/logo iskan 5.svg" alt="Ikshan Logo" className="logo-image" />
          <span className="logo-text">Ikshan</span>
        </div>
        
        <div className="header-controls">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'vertical' ? 'active' : ''}`}
              onClick={() => setViewMode('vertical')}
              title="Classic Chat View"
            >
              <MessageSquare size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'horizontal' ? 'active' : ''}`}
              onClick={() => setViewMode('horizontal')}
              title="Step Card View (Beta)"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          
          <button
            className="products-btn"
            onClick={handleProductsClick}
            aria-label="View Products"
            title="View Our Products"
          >
            <Package size={18} />
            <span>Products</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-chat-section" id="chat">
          {viewMode === 'vertical' ? <ChatBot /> : <ChatBotHorizontal />}
        </section>

        {viewMode === 'vertical' && (
          <section className="products-section-wrapper" id="products" ref={productsRef}>
            <ProductSection />
          </section>
        )}

        {/* Products Overlay for Horizontal Mode */}
        {viewMode === 'horizontal' && showProducts && (
          <div className="products-overlay">
            <div className="products-overlay-content">
              <button className="close-overlay" onClick={() => setShowProducts(false)}>
                ✕
              </button>
              <ProductSection />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Ikshan. All rights reserved. Empowering businesses with AI innovation.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
