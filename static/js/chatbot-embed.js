/**
 * College Dashboard Chatbot - Embed Script
 * Use this script to easily embed the chatbot into any webpage
 */

(function() {
    // Create a container for the iframe and button
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'college-dashboard-chatbot';
    chatbotContainer.style.position = 'fixed';
    chatbotContainer.style.bottom = '0';
    chatbotContainer.style.right = '0';
    chatbotContainer.style.zIndex = '9999';
    
    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
    toggleButton.style.width = '60px';
    toggleButton.style.height = '60px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = '#4b2e83';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    toggleButton.style.fontSize = '24px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.margin = '30px';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.transition = 'all 0.3s ease';
    
    // Create the iframe (initially hidden)
    const chatIframe = document.createElement('iframe');
    chatIframe.src = 'http://localhost:5000'; // Change this to your actual chatbot URL
    chatIframe.style.width = '350px';
    chatIframe.style.height = '600px';
    chatIframe.style.border = 'none';
    chatIframe.style.borderRadius = '10px';
    chatIframe.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    chatIframe.style.display = 'none'; // Initially hidden
    chatIframe.style.marginBottom = '20px';
    chatIframe.style.marginRight = '30px';
    chatIframe.style.transition = 'all 0.3s ease';
    
    // Add elements to the container
    chatbotContainer.appendChild(chatIframe);
    chatbotContainer.appendChild(toggleButton);
    
    // Add the container to the document
    document.body.appendChild(chatbotContainer);
    
    // Add Font Awesome if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Toggle chatbot visibility
    toggleButton.addEventListener('click', function() {
        if (chatIframe.style.display === 'none') {
            chatIframe.style.display = 'block';
            toggleButton.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            chatIframe.style.display = 'none';
            toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
        }
    });
})();