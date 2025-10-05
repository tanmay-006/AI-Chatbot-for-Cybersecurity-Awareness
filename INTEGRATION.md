# Integration Guide

This document provides instructions on how to integrate the College Dashboard Chatbot into your existing website.

## Method 1: Embed using JavaScript

1. Add this script tag to your website where you want the chatbot to appear:

```html
<script src="https://your-domain.com/static/js/chatbot-embed.js"></script>
```

Replace `https://your-domain.com` with the URL where your chatbot is hosted.

This method will automatically add a chat button in the bottom-right corner of your website. When clicked, it will open the chatbot interface.

## Method 2: Using an iframe

If you prefer more control over the placement and appearance of the chatbot, you can use an iframe:

```html
<div style="position: fixed; bottom: 100px; right: 30px; z-index: 9999;">
  <iframe src="https://your-domain.com" 
    width="350" 
    height="600" 
    style="border: none; border-radius: 10px; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);">
  </iframe>
</div>
```

## Method 3: API Integration

For more advanced use cases, you can directly interact with the chatbot API:

```javascript
// Example: Sending a message to the chatbot API
fetch('https://your-domain.com/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, I need help with course registration'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Chatbot response:', data.response);
});
```

## Example Integration

Check out a live example of the integration at:

```
http://localhost:5000/integration-example
```

## Customization

You can customize the appearance of the chatbot by modifying the CSS variables:

```css
:root {
  --primary-color: #4b2e83; /* Main color */
  --primary-color-dark: #371f5e; /* Darker shade for hover states */
  --bot-bg: #f0f0f0; /* Bot message background */
  --user-bg: #4b2e83; /* User message background */
  --user-text: white; /* User message text color */
  --bot-text: #333; /* Bot message text color */
  --container-bg: white; /* Chat container background */
  --border-color: #eaeaea; /* Border color */
}
```

You can override these variables in your website's CSS to match your branding.