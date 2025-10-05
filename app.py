from flask import Flask, request, jsonify, render_template, Response, stream_with_context
from flask_cors import CORS
from chat import client, types
import json

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)  # Enable CORS for all routes - allows integration with college dashboard

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST", "GET"])
def chat():
    # Handle both GET and POST requests
    if request.method == "POST":
        data = request.json
        user_message = data.get("message", "")
    else:  # GET request
        user_message = request.args.get("message", "")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # For markdown examples, don't stream the response
    if "format" in user_message.lower() or "markdown" in user_message.lower():
        markdown_example = """I can format my responses using Markdown:

## College Resources
**Important deadlines** and *key information*

### Available Services:
* Academic Calendar
* Course Registration
* Exam Schedule
  * Final Exams
  * Mid-terms

### Navigation Example:
```
To find your grades:
1. Click on 'Academic Records' in the main menu
2. Select 'Grade History'
3. Choose the semester you want to view
```

> Reminder: The course registration deadline for next semester is October 15, 2025!

[College Website](https://www.college-example.edu)

Just ask your questions about the college dashboard, and I'll help you navigate the system!"""
        
        # Return JSON for POST, EventStream for GET
        if request.method == "POST":
            return jsonify({"response": markdown_example})
        else:
            def generate():
                yield f"data: {json.dumps({'chunk': markdown_example})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"
            return Response(stream_with_context(generate()), content_type='text/event-stream')

    # Stream the response
    return Response(stream_with_context(generate_stream_response(user_message)), 
                    content_type='text/event-stream')

def generate_stream_response(input_text):
    system_instructions = """You are a college dashboard assistant chatbot. Your primary goal is to help users navigate the college system, answer questions about college services, and provide assistance with using the dashboard interface. 

    You should offer clear, accurate, and practical information about topics such as course registration, exam schedules, academic calendar, student resources, faculty information, and campus facilities. Maintain a friendly and informative tone, and ensure that your responses are easy to understand for all users.

    Use Markdown formatting to make your responses more readable:
    - Use headings (## and ###) to organize information
    - Use **bold** for important terms or deadlines
    - Use *italics* for emphasis
    - Use bullet points or numbered lists for steps or multiple items
    - Use `code` formatting for specific menu options or commands
    - Use ```code blocks``` for longer examples
    - Use > blockquotes for important notes or announcements

    Encourage users to explore the college dashboard features and make the most of the available resources.
    you are developed and trained by Tanmay Bandagale."""
    
    response = client.models.generate_content_stream(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=system_instructions),
        contents=input_text
    )
    
    for chunk in response:
        if chunk.text:
            # Send each chunk as a server-sent event
            yield f"data: {json.dumps({'chunk': chunk.text})}\n\n"
    
    # Send a completion event
    yield f"data: {json.dumps({'done': True})}\n\n"

if __name__ == "__main__":
    # Running on port 5000 for integration with college dashboard website
    app.run(debug=True, host="0.0.0.0", port=5000)
