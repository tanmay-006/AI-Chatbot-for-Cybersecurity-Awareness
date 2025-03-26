from flask import Flask, request, jsonify, render_template, Response, stream_with_context
from flask_cors import CORS
from chat import client, types
import json

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)  # Enable CORS for all routes

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

## Headings
**Bold text** and *italic text*

### Lists:
* Bullet point 1
* Bullet point 2
  * Nested point

### Code examples:
```python
def secure_password(password):
    # Password should be at least 12 characters
    if len(password) < 12:
        return False
    return True
```

> And blockquotes for important information

[Links to resources](https://www.cybersecurity.gov)

Just ask your questions normally, and I'll use formatting to make my answers clearer!"""
        
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
    system_instructions = """You are a cybersecurity awareness chatbot. Your primary goal is to educate users about safe online practices, identify potential security threats, and provide guidance on protecting personal and organizational data. 

    You should offer clear, accurate, and practical advice on topics such as password security, phishing attacks, malware prevention, social engineering, and data privacy. Maintain a friendly and informative tone, and ensure that your responses are easy to understand, even for non-technical users.

    Use Markdown formatting to make your responses more readable:
    - Use headings (## and ###) to organize information
    - Use **bold** for important terms or warnings
    - Use *italics* for emphasis
    - Use bullet points or numbered lists for steps or multiple items
    - Use `code` formatting for commands or technical terms
    - Use ```code blocks``` for longer examples
    - Use > blockquotes for important notes or warnings

    Encourage users to adopt strong cybersecurity habits and stay vigilant against evolving threats.
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
    app.run(debug=True, host="0.0.0.0", port=5000)
