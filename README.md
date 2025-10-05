# College Dashboard Chatbot Assistant

An interactive chatbot built with Flask and Google's Gemini AI model, integrated into a college dashboard website. The chatbot is designed to respond to user queries and assist in navigating the system, providing a simple yet functional conversational interface for students, faculty, and staff.

## Features

- Real-time chat interface with streaming responses
- Markdown formatting for clear and structured responses
- Comprehensive college assistance covering:
  - Course registration and academic information
  - Exam schedules and grading information
  - Campus facilities and resources
  - Student services and support
  - Dashboard navigation and features

## Tech Stack

- Flask (Python web framework)
- Google Gemini AI
- Flask-CORS for integration with college dashboard
- HTML/CSS/JavaScript (Frontend)
- JSON for data exchange format

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

## Integration

This chatbot is designed to be embedded within a college dashboard website. The system demonstrates client-server communication using:

- Frontend: HTML, CSS, and JavaScript
- Backend: Flask (Python)
- Data exchange: JSON format

## Usage

Students and staff can interact with the chatbot to:
- Get information about courses and registration
- Check exam schedules
- Find campus resources
- Navigate the dashboard interface
- Access student services

## Author

Developed by Tanmay Bandagale
