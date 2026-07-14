/**
 * HMS Chatbot Integration Client Script
 * Dynamically injects the chatbot markup and handles interactions, suggestion chips,
 * and API calls to the automated auto-responder.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Build and Inject Chatbot HTML
    injectChatbot();

    // 2. DOM Elements Ref
    const launcher = document.getElementById('chatbotLauncher');
    const windowEl = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const messageList = document.getElementById('chatbotMessages');
    const inputField = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const chipContainer = document.getElementById('chatbotChips');

    // State Variables
    let isOpen = false;

    // 3. Event Listeners
    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    
    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // 4. Toggle Chat Window
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            launcher.classList.add('active');
            windowEl.classList.add('active');
            inputField.focus();
            
            // Add initial welcome if empty
            if (messageList.children.length === 0) {
                showBotResponse("Hello! 👋 I am your HMS Support Assistant. Ask me anything about our doctors, clinic hours, or appointment booking process!");
                showSuggestions(['Available Doctors', 'Hospital Hours', 'How to Book?']);
            }
        } else {
            launcher.classList.remove('active');
            windowEl.classList.remove('active');
        }
    }

    // 5. Send Message Handler
    async function handleSend() {
        const query = inputField.value.trim();
        if (!query) return;

        // Clear input
        inputField.value = '';

        // Append User Message Bubble
        appendMessage(query, 'user');
        
        // Hide Suggestion Chips during answer retrieval
        chipContainer.style.display = 'none';

        // Add Typing Indicator
        const typingEl = showTypingIndicator();

        try {
            // Check if user is logged in
            const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            const payload = {
                name: localUser ? localUser.name : 'Web Guest',
                email: localUser ? localUser.email : 'guest@hospital.com',
                subject: 'Chatbot Inquiry',
                message: query
            };

            const response = await fetch('/api/support/inquire', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            // Remove typing indicator
            typingEl.remove();

            if (response.ok && data.inquiry) {
                showBotResponse(data.inquiry.aiResponse || "I've logged your request, but I'm unable to process a response right now. Our support team will check it!");
            } else {
                showBotResponse("Sorry, I encountered an issue connecting to the system. Please try again later.");
            }
        } catch (err) {
            console.error('Chatbot API Error:', err);
            typingEl.remove();
            showBotResponse("Sorry, there was an error sending your message. Please check your internet connection.");
        }

        // Show standard suggestions back
        showSuggestions(['Available Doctors', 'Hospital Hours', 'How to Book?']);
    }

    // 6. Support Functions
    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        
        if (sender === 'bot') {
            // Basic Markdown/HTML paragraph formatter
            bubble.innerHTML = formatBotMessage(text);
        } else {
            bubble.textContent = text;
        }

        messageList.appendChild(bubble);
        messageList.scrollTop = messageList.scrollHeight;
        return bubble;
    }

    function showBotResponse(text) {
        return appendMessage(text, 'bot');
    }

    function showTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot typing';
        bubble.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messageList.appendChild(bubble);
        messageList.scrollTop = messageList.scrollHeight;
        return bubble;
    }

    function showSuggestions(suggestions) {
        chipContainer.innerHTML = '';
        chipContainer.style.display = 'flex';

        suggestions.forEach(sug => {
            const btn = document.createElement('button');
            btn.className = 'chip-btn';
            btn.textContent = sug;
            btn.addEventListener('click', () => {
                inputField.value = sug;
                handleSend();
            });
            chipContainer.appendChild(btn);
        });
    }

    function formatBotMessage(text) {
        // Convert bold markdown (**text**) to HTML
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert bullets (- text or * text) to lists
        if (html.includes('\n- ') || html.includes('\n* ')) {
            const lines = html.split('\n');
            let inList = false;
            html = lines.map(line => {
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    const content = line.trim().substring(2);
                    let prefix = '';
                    if (!inList) {
                        prefix = '<ul>';
                        inList = true;
                    }
                    return `${prefix}<li>${content}</li>`;
                } else {
                    let suffix = '';
                    if (inList) {
                        suffix = '</ul>';
                        inList = false;
                    }
                    return `${suffix}${line}<br>`;
                }
            }).join('');
            if (inList) html += '</ul>';
        } else {
            // Replace newlines with <br>
            html = html.replace(/\n/g, '<br>');
        }
        return html;
    }

    // Chatbot HTML Injection Template
    function injectChatbot() {
        // Create Launcher HTML
        const launcherDiv = document.createElement('div');
        launcherDiv.id = 'chatbotLauncher';
        launcherDiv.className = 'chatbot-launcher';
        launcherDiv.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                <circle cx="8" cy="9" r="1.5" fill="#ffffff"/>
                <circle cx="12" cy="9" r="1.5" fill="#ffffff"/>
                <circle cx="16" cy="9" r="1.5" fill="#ffffff"/>
            </svg>
        `;

        // Create Chat Window HTML
        const windowDiv = document.createElement('div');
        windowDiv.id = 'chatbotWindow';
        windowDiv.className = 'chatbot-window';
        windowDiv.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-header-avatar">H</div>
                    <div class="chatbot-header-title">
                        <h4>HMS Assistant</h4>
                        <div class="chatbot-header-status">Online</div>
                    </div>
                </div>
                <button id="chatbotClose" class="chatbot-header-close">&times;</button>
            </div>
            <div id="chatbotMessages" class="chatbot-messages"></div>
            <div id="chatbotChips" class="chatbot-chips"></div>
            <div class="chatbot-input-container">
                <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Type a message…" autocomplete="off">
                <button id="chatbotSend" class="chatbot-send-btn">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(launcherDiv);
        document.body.appendChild(windowDiv);
    }
});
