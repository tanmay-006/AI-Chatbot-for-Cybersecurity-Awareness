<?php
// index.php
?>
<div id="chatbot-container" style="display: none;">
    <!-- Chatbot will be loaded here -->
</div>

<button id="chat-toggle-btn" class="chat-btn">
    <i class="fas fa-comments"></i>
</button>

<script>
// You can include this directly or in a separate JS file
document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    
    // Create iframe for the chatbot
    const chatFrame = document.createElement('iframe');
    chatFrame.src = 'http://127.0.0.1:5000/';
    chatFrame.style.width = '200px';
    chatFrame.style.height = '800px';
    chatFrame.style.border = 'none';
    
    // Add iframe to container
    chatbotContainer.appendChild(chatFrame);
    
    // Toggle chatbot visibility
    chatToggleBtn.addEventListener('click', function() {
        if (chatbotContainer.style.display === 'none') {
            chatbotContainer.style.display = 'block';
        } else {
            chatbotContainer.style.display = 'none';
        }
    });
});
</script>

<style>
/* You can include this in your main CSS file */
#chatbot-container {
    position: fixed;
    bottom: 90px;
    right: 30px;
    z-index: 1000;
}

.chat-btn {
    position: fixed;
    bottom: 20px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #6c4ab6;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: none;
    z-index: 1001;
}

.chat-btn:hover {
    background-color: #5639a8;
}
</style>