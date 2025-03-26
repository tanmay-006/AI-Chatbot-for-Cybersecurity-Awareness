# AI Chatbot for Cybersecurity Awareness

An interactive chatbot built with Flask and Google's Gemini AI model to educate users about cybersecurity best practices, safe online behavior, and threat prevention.

## Features

- Real-time chat interface with streaming responses
- Markdown formatting for clear and structured responses
- Comprehensive cybersecurity guidance covering:
  - Password security
  - Phishing attacks
  - Malware prevention
  - Social engineering
  - Data privacy

## Tech Stack

- Flask (Python web framework)
- Google Gemini AI
- Flask-CORS
- HTML/CSS/JavaScript (Frontend)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/tanmay-006/AI-Chatbot-for-Cybersecurity-Awareness.git
cd AI-Chatbot-for-Cybersecurity-Awareness
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
- Create a `.env` file in the root directory
- Add your Gemini API key: `GEMINI_API_KEY=your_api_key_here`

4. Run the application:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## Usage

Visit the web interface and start asking questions about cybersecurity. The chatbot provides formatted, easy-to-understand responses with practical guidance on staying safe online.

## Author

Developed by Tanmay Bandagale
