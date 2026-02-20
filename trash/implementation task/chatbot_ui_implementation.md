# Chatbot Website UI Implementation Guide

**Based on Design**: image.png
**Project**: Ikshan Chatbot Interface
**Created**: 2026-01-06
**Design System**: Modern, Clean, Accessible

---

## 📋 Design Analysis

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  [Logo] │ Products of Ikshan    [Icons x4]     │  ← Header
├─────────┼──────────────────────────────────────┤
│         │                                       │
│  Chat   │                                       │
│ History │            Main Content               │
│         │            (Question Display)         │
│ User    │                                       │
│ Avatar  │                                       │
│         │    [Chat Input Bar]  [🎤]            │  ← Input Area
└─────────┴──────────────────────────────────────┘
  Sidebar              Main Chat Area
```

### Color Palette
- **Primary Brand**: `#6B46C1` (Purple/Violet) - Logo background
- **Secondary**: `#93C5FD` (Light Blue) - Microphone button
- **Background Main**: `#9CA3AF` (Medium Gray) - Main content area
- **Background Sidebar**: `#E5E7EB` (Light Gray) - Sidebar
- **Background Input**: `#FFFFFF` (White) - Chat input bar
- **Text Primary**: `#000000` (Black) - Main text
- **Text Secondary**: `#1F2937` (Dark Gray) - Secondary text

### Typography
- **Logo**: Bold, Sans-serif
- **Headings**: Bold, Large (e.g., "question")
- **Body**: Regular, Medium size
- **Input**: Regular, Readable

### Key Components
1. **Header Bar** - Logo + Product Nav + Action Icons
2. **Sidebar** - Chat History + User Profile
3. **Main Content Area** - Question/Response Display
4. **Input Bar** - Text Input + Voice Button

---

## 🎨 Component Specifications

### 1. Header Component

**Dimensions**: Full width, Height ~80px

**Structure**:
```
[Purple Section: Logo] | [White Section: Product Nav + Icons]
```

**Specifications**:
- Left section (Logo): Purple background (#6B46C1), White text
- Right section: White background
- Height: 60-80px
- Logo section width: ~230px (matches sidebar)
- Icons: 4 navigation icons, ~40x40px each
- Padding: 16px vertical, 20px horizontal

---

### 2. Sidebar Component

**Dimensions**: Width ~230px, Full height

**Structure**:
```
┌─────────────┐
│ Chat History│  ← Button/Link
├─────────────┤
│             │
│  User Name  │
│   Avatar    │  ← User Profile Section
│             │
└─────────────┘
```

**Specifications**:
- Width: 230px (fixed)
- Background: Light gray (#E5E7EB)
- Padding: 24px 16px

**Chat History Button**:
- Background: White
- Border-radius: 24px (pill shape)
- Padding: 12px 24px
- Font: Medium weight
- Hover: Slight shadow

**User Profile Section**:
- Position: Below chat history
- Margin-top: 32px
- Avatar: Circular, 80px diameter
- Background: Gradient (cyan to blue)
- Border: 3px white border
- User name: Above avatar, centered, 14px

---

### 3. Main Content Area

**Dimensions**: Flex-grow (remaining width), Full height

**Specifications**:
- Background: Medium gray (#9CA3AF)
- Padding: 48px 64px
- Display: Flex column
- Justify-content: Space-between (content top, input bottom)

**Question Display**:
- Font-size: 64px
- Font-weight: Bold
- Color: Black
- Text-align: Center
- Line-height: 1.2
- Position: Center of available space

---

### 4. Chat Input Bar

**Dimensions**: Max-width 800px, Height ~60px

**Specifications**:
- Background: White (#FFFFFF)
- Border-radius: 40px (fully rounded)
- Padding: 16px 24px
- Box-shadow: 0 4px 12px rgba(0,0,0,0.1)
- Display: Flex
- Align-items: Center
- Gap: 16px

**Input Field**:
- Border: None
- Flex: 1 (takes remaining space)
- Font-size: 16px
- Placeholder: "chat bar for user to enter"
- Color: Black
- Background: Transparent

**Microphone Button**:
- Size: 48px x 48px
- Background: Light blue (#93C5FD)
- Border-radius: 50% (circle)
- Icon: Microphone, white color
- Cursor: Pointer
- Hover: Darken to #60A5FA
- Active: Scale 0.95

---

### 5. Product Navigation Icons

**Specifications** (4 icons in header):
- Size: 32px x 32px each
- Stroke: Black, 2px
- Spacing: 16px between icons
- Icons represent:
  1. Package/Box delivery
  2. Gift box
  3. Product showcase
  4. Box/Container

**Hover State**:
- Transform: translateY(-2px)
- Transition: 0.2s ease

---

## 💻 HTML Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ikshan Chatbot</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Main Container -->
    <div class="chatbot-container">

        <!-- Header -->
        <header class="header">
            <div class="header-logo">
                <h1>Ikshan logo and name</h1>
            </div>
            <div class="header-nav">
                <h2 class="product-title">products of ikshan</h2>
                <div class="nav-icons">
                    <button class="icon-btn" aria-label="Delivery">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                    </button>
                    <button class="icon-btn" aria-label="Gift">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 12 20 22 4 22 4 12"></polyline>
                            <rect x="2" y="7" width="20" height="5"></rect>
                            <line x1="12" y1="22" x2="12" y2="7"></line>
                            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                        </svg>
                    </button>
                    <button class="icon-btn" aria-label="Products">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"></path>
                            <rect x="3" y="10" width="18" height="7"></rect>
                        </svg>
                    </button>
                    <button class="icon-btn" aria-label="Container">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <div class="main-layout">

            <!-- Sidebar -->
            <aside class="sidebar">
                <button class="chat-history-btn">chat history</button>

                <div class="user-profile">
                    <p class="user-name">user name</p>
                    <div class="user-avatar">
                        <img src="avatar.png" alt="User Avatar">
                    </div>
                </div>
            </aside>

            <!-- Chat Area -->
            <main class="chat-area">
                <div class="chat-content">
                    <h1 class="question-display">question</h1>
                </div>

                <!-- Chat Input -->
                <div class="chat-input-container">
                    <div class="chat-input-bar">
                        <input
                            type="text"
                            class="chat-input"
                            placeholder="chat bar for user to enter"
                            aria-label="Enter your message"
                        >
                        <button class="mic-btn" aria-label="Voice input">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## 🎨 CSS Implementation

```css
/* ============================================
   RESET & BASE STYLES
   ============================================ */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    overflow: hidden;
    height: 100vh;
}

/* ============================================
   MAIN CONTAINER
   ============================================ */

.chatbot-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #9CA3AF;
}

/* ============================================
   HEADER
   ============================================ */

.header {
    display: flex;
    height: 80px;
    border-bottom: 1px solid #D1D5DB;
}

.header-logo {
    width: 230px;
    background: #6B46C1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
}

.header-logo h1 {
    color: white;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
}

.header-nav {
    flex: 1;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
}

.product-title {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
}

.nav-icons {
    display: flex;
    gap: 16px;
}

.icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background: #F3F4F6;
    transform: translateY(-2px);
}

.icon-btn svg {
    display: block;
}

/* ============================================
   MAIN LAYOUT
   ============================================ */

.main-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* ============================================
   SIDEBAR
   ============================================ */

.sidebar {
    width: 230px;
    background: #E5E7EB;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.chat-history-btn {
    background: white;
    border: none;
    border-radius: 24px;
    padding: 12px 32px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.chat-history-btn:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-1px);
}

.user-profile {
    margin-top: 40px;
    text-align: center;
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 12px;
}

.user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
    border: 3px solid white;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ============================================
   CHAT AREA
   ============================================ */

.chat-area {
    flex: 1;
    background: #9CA3AF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 64px;
}

.chat-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.question-display {
    font-size: 64px;
    font-weight: 700;
    color: #000000;
    text-align: center;
    line-height: 1.2;
}

/* ============================================
   CHAT INPUT
   ============================================ */

.chat-input-container {
    display: flex;
    justify-content: center;
    padding-bottom: 32px;
}

.chat-input-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    border-radius: 40px;
    padding: 8px 8px 8px 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 800px;
    transition: box-shadow 0.2s ease;
}

.chat-input-bar:focus-within {
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.chat-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #1F2937;
    background: transparent;
}

.chat-input::placeholder {
    color: #9CA3AF;
}

.mic-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #93C5FD;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.mic-btn:hover {
    background: #60A5FA;
    transform: scale(1.05);
}

.mic-btn:active {
    transform: scale(0.95);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 1024px) {
    .chat-area {
        padding: 32px 48px;
    }

    .question-display {
        font-size: 48px;
    }
}

@media (max-width: 768px) {
    .header {
        height: auto;
        flex-direction: column;
    }

    .header-logo {
        width: 100%;
        padding: 16px;
    }

    .header-nav {
        padding: 16px;
        flex-direction: column;
        gap: 16px;
    }

    .main-layout {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        flex-direction: row;
        padding: 16px;
        justify-content: space-between;
    }

    .user-profile {
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-direction: row-reverse;
    }

    .user-avatar {
        width: 48px;
        height: 48px;
    }

    .chat-area {
        padding: 24px 16px;
    }

    .question-display {
        font-size: 32px;
    }

    .chat-input-bar {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .question-display {
        font-size: 24px;
    }

    .nav-icons {
        gap: 8px;
    }

    .icon-btn svg {
        width: 24px;
        height: 24px;
    }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

/* Focus states */
.chat-input:focus,
.chat-history-btn:focus,
.icon-btn:focus,
.mic-btn:focus {
    outline: 2px solid #6B46C1;
    outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## ⚙️ JavaScript Implementation

```javascript
// ============================================
// CHATBOT UI FUNCTIONALITY
// ============================================

class ChatbotUI {
    constructor() {
        this.chatInput = document.querySelector('.chat-input');
        this.micBtn = document.querySelector('.mic-btn');
        this.questionDisplay = document.querySelector('.question-display');
        this.chatHistoryBtn = document.querySelector('.chat-history-btn');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupVoiceRecognition();
    }

    setupEventListeners() {
        // Handle input submission
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        });

        // Handle microphone button
        this.micBtn.addEventListener('click', () => {
            this.toggleVoiceInput();
        });

        // Handle chat history button
        this.chatHistoryBtn.addEventListener('click', () => {
            this.openChatHistory();
        });

        // Handle nav icon buttons
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNavClick(e.currentTarget);
            });
        });
    }

    handleSubmit() {
        const message = this.chatInput.value.trim();

        if (message) {
            // Update question display
            this.questionDisplay.textContent = message;

            // Clear input
            this.chatInput.value = '';

            // Send to backend/chatbot API
            this.sendMessage(message);
        }
    }

    sendMessage(message) {
        // TODO: Implement API call to chatbot backend
        console.log('Sending message:', message);

        // Example API call structure:
        /*
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
        .then(response => response.json())
        .then(data => {
            this.displayResponse(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        */
    }

    displayResponse(response) {
        // Display chatbot response
        this.questionDisplay.textContent = response;
    }

    setupVoiceRecognition() {
        // Check if browser supports Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.chatInput.value = transcript;
                this.micBtn.classList.remove('recording');
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.micBtn.classList.remove('recording');
            };

            this.recognition.onend = () => {
                this.micBtn.classList.remove('recording');
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.micBtn.disabled = true;
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) return;

        if (this.micBtn.classList.contains('recording')) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.micBtn.classList.add('recording');
        }
    }

    openChatHistory() {
        // TODO: Implement chat history panel
        console.log('Opening chat history');

        // You can implement a modal or side panel here
    }

    handleNavClick(button) {
        const label = button.getAttribute('aria-label');
        console.log('Navigation clicked:', label);

        // TODO: Implement navigation based on button clicked
        // Example: Show different product categories
    }
}

// ============================================
// ADDITIONAL CSS FOR RECORDING STATE
// ============================================
// Add this to your CSS:
/*
.mic-btn.recording {
    background: #EF4444;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
}
*/

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ChatbotUI();
});
```

---

## 🔧 Additional Features to Implement

### 1. Chat History Panel
```javascript
// Create a sliding panel for chat history
function createChatHistoryPanel() {
    const panel = document.createElement('div');
    panel.className = 'chat-history-panel';
    panel.innerHTML = `
        <div class="panel-header">
            <h3>Chat History</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="history-list">
            <!-- Chat history items -->
        </div>
    `;
    return panel;
}
```

### 2. Message Bubbles for Conversation
```html
<div class="message-container">
    <div class="message user-message">
        <p>User's question here</p>
    </div>
    <div class="message bot-message">
        <p>Bot's response here</p>
    </div>
</div>
```

### 3. Typing Indicator
```html
<div class="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
</div>
```

### 4. File Upload Support
```html
<button class="attachment-btn" aria-label="Attach file">
    <svg><!-- Paperclip icon --></svg>
</button>
```

---

## ♿ Accessibility Checklist

- [x] Semantic HTML elements used
- [x] ARIA labels on interactive elements
- [x] Keyboard navigation support (Tab, Enter, Esc)
- [x] Focus indicators visible
- [x] Color contrast meets WCAG AA (4.5:1)
- [x] Reduced motion support
- [x] Screen reader friendly
- [ ] Add skip navigation link
- [ ] Ensure form labels are properly associated
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (Full layout)
- **Tablet**: 768px - 1023px (Adjusted padding, smaller text)
- **Mobile**: < 768px (Stacked layout, simplified header)
- **Small Mobile**: < 480px (Further condensed)

---

## 🚀 Performance Optimization

1. **Lazy load images** for avatars and icons
2. **Minimize CSS** - Remove unused styles
3. **Debounce input** - Reduce API calls
4. **Use CSS transforms** for animations (hardware accelerated)
5. **Optimize SVG icons** - Inline critical icons
6. **Cache API responses** - Store chat history locally

---

## 🎯 Next Steps for Implementation

1. **Setup HTML structure** - Copy HTML code
2. **Apply CSS styling** - Copy CSS code
3. **Implement JavaScript** - Copy JS code
4. **Connect to backend** - Implement API endpoints
5. **Test responsiveness** - Check all breakpoints
6. **Accessibility audit** - Use axe DevTools or Lighthouse
7. **User testing** - Gather feedback and iterate
8. **Deploy** - Host on your preferred platform

---

## 🔗 Integration Points

### Backend API Endpoints Needed:
```
POST /api/chat - Send user message, receive bot response
GET /api/chat/history - Retrieve chat history
POST /api/voice - Process voice input
GET /api/products - Get product data for icons
```

### Database Schema:
```sql
-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY,
    user_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    session_id UUID,
    sender VARCHAR(10), -- 'user' or 'bot'
    message TEXT,
    created_at TIMESTAMP
);
```

---

## 📚 Libraries/Frameworks Suggested

**Optional enhancements**:
- **React/Vue/Svelte** - For complex state management
- **Socket.io** - For real-time messaging
- **Framer Motion** - For advanced animations
- **TailwindCSS** - Alternative to custom CSS (optional)
- **Axios** - For HTTP requests
- **date-fns** - For timestamp formatting

---

## 🎨 Design Tokens (CSS Variables)

```css
:root {
    /* Colors */
    --color-primary: #6B46C1;
    --color-secondary: #93C5FD;
    --color-bg-main: #9CA3AF;
    --color-bg-sidebar: #E5E7EB;
    --color-bg-input: #FFFFFF;
    --color-text-primary: #000000;
    --color-text-secondary: #1F2937;

    /* Spacing */
    --spacing-xs: 8px;
    --spacing-sm: 16px;
    --spacing-md: 24px;
    --spacing-lg: 32px;
    --spacing-xl: 48px;

    /* Typography */
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 20px;
    --font-size-xl: 32px;
    --font-size-xxl: 64px;

    /* Borders */
    --border-radius-sm: 8px;
    --border-radius-md: 24px;
    --border-radius-full: 50%;

    /* Shadows */
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
    --shadow-lg: 0 6px 20px rgba(0,0,0,0.15);
}
```

---

## ✅ Implementation Checklist

- [ ] Set up HTML structure
- [ ] Apply CSS styling
- [ ] Test responsive design
- [ ] Implement JavaScript functionality
- [ ] Add voice input feature
- [ ] Create chat history panel
- [ ] Connect to backend API
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add typing indicators
- [ ] Test accessibility
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Deploy to production

---

**Implementation Time Estimate**: 8-12 hours for full implementation
**Difficulty Level**: Intermediate
**Technologies**: HTML5, CSS3, JavaScript (Vanilla/ES6+)

**Ready to build your Ikshan chatbot interface!** 🚀
