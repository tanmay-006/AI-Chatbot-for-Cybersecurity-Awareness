document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    const clearBtn = document.getElementById('clearBtn');
    const themeToggle = document.getElementById('themeToggle');
    const aboutLink = document.getElementById('aboutLink');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatContainer = document.getElementById('chatContainer');

    // Configure marked options
    marked.setOptions({
        breaks: true,  // Enable line breaks
        gfm: true,     // GitHub Flavored Markdown
        highlight: function(code, language) {
            if (language && hljs.getLanguage(language)) {
                return hljs.highlight(code, { language }).value;
            }
            return hljs.highlightAuto(code).value;
        }
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Function to add a user message to the chat
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to start a bot message
    function startBotMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.id = 'currentBotMessage';
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.id = 'currentBotContent';
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);
        
        return messageContent;
    }

    // Function to add typing indicator
    function addTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-indicator';
        indicator.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        for(let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            content.appendChild(dot);
        }
        
        indicator.appendChild(avatar);
        indicator.appendChild(content);
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Function to send user message to API and get streaming response
    async function sendMessage(message) {
        // Disable input while processing
        userInput.disabled = true;
        sendBtn.disabled = true;
        
        addUserMessage(message);
        userInput.value = '';
        
        addTypingIndicator();
        
        try {
            // For specific commands that return markdown examples, use the regular fetch
            if (message.toLowerCase().includes('format') || message.toLowerCase().includes('markdown')) {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });
                
                const data = await response.json();
                removeTypingIndicator();
                
                if (response.ok) {
                    // Create a new bot message with the response
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message bot';
                    
                    const avatar = document.createElement('div');
                    avatar.className = 'avatar';
                    avatar.innerHTML = '<i class="fas fa-robot"></i>';
                    
                    const messageContent = document.createElement('div');
                    messageContent.className = 'message-content';
                    
                    // Render markdown
                    messageContent.innerHTML = marked.parse(data.response);
                    
                    // Apply syntax highlighting to code blocks
                    messageContent.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                    
                    messageDiv.appendChild(avatar);
                    messageDiv.appendChild(messageContent);
                    chatBox.appendChild(messageDiv);
                } else {
                    // Create error message
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message bot';
                    
                    const avatar = document.createElement('div');
                    avatar.className = 'avatar';
                    avatar.innerHTML = '<i class="fas fa-robot"></i>';
                    
                    const messageContent = document.createElement('div');
                    messageContent.className = 'message-content';
                    messageContent.textContent = 'Sorry, there was an error processing your request.';
                    
                    messageDiv.appendChild(avatar);
                    messageDiv.appendChild(messageContent);
                    chatBox.appendChild(messageDiv);
                    
                    console.error('Error:', data.error);
                }
            } else {
                // For normal messages, use streaming response
                removeTypingIndicator();
                
                // Start a new bot message that we'll update incrementally
                const botContent = startBotMessage();
                let fullResponse = '';
                
                // Create a URL with proper encoding
                const streamUrl = `/api/chat?message=${encodeURIComponent(message)}`;
                
                // Create EventSource for streaming
                const eventSource = new EventSource(streamUrl);
                
                eventSource.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    
                    if (data.chunk) {
                        fullResponse += data.chunk;
                        // Update the content with the currently accumulated response
                        botContent.innerHTML = marked.parse(fullResponse);
                        
                        // Apply syntax highlighting to code blocks
                        botContent.querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });
                        
                        // Scroll as new content arrives
                        chatBox.scrollTop = chatBox.scrollHeight;
                    }
                    
                    if (data.done) {
                        eventSource.close();
                    }
                };
                
                eventSource.onerror = function(error) {
                    console.error('EventSource error:', error);
                    eventSource.close();
                    
                    // If the response was empty, show an error message
                    if (!fullResponse) {
                        botContent.textContent = 'Sorry, there was an error connecting to the server.';
                    }
                };
            }
        } catch (error) {
            removeTypingIndicator();
            
            // Create error message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = 'Sorry, there was an error connecting to the server.';
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
            chatBox.appendChild(messageDiv);
            
            console.error('Error:', error);
        } finally {
            // Re-enable input
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
            }
        }
    });

    // Event listeners for suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.textContent;
            sendMessage(message);
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Change icon
        themeToggle.innerHTML = isDarkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    });

    // Clear chat history
    clearBtn.addEventListener('click', () => {
        // Keep only the first welcome message
        const firstMessage = chatBox.querySelector('.message');
        while (chatBox.firstChild) {
            chatBox.removeChild(chatBox.firstChild);
        }
        chatBox.appendChild(firstMessage);
    });

    // About link
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sendMessage("Tell me about this college dashboard assistant and what it can do");
    });

    // Set focus on input when page loads
    userInput.focus();
    
    // Initially hide the chat container
    chatContainer.classList.add('hidden');
    
    // Toggle chat visibility when the toggle button is clicked
    chatToggleBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        if (!chatContainer.classList.contains('hidden')) {
            userInput.focus();
        }
    });
});
