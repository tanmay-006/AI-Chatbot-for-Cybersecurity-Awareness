from google import genai
import io
import httpx
import pathlib
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

model_name="gemini-1.5-flash-002"

""" doc_url_1 = "https://ai.google.dev/gemini-api/docs/document-processing?lang=python#caching-pdfs" # Replace with the URL to your first PDF
doc_url_2 = "https://ai.google.dev/gemini-api/docs/text-generation?lang=python" # Replace with the URL to your second PDF

# Retrieve and upload both PDFs using the File API
file_path = io.BytesIO(httpx.get(doc_url_1).content)
file_path2 = io.BytesIO(httpx.get(doc_url_2).content) """


file_path = pathlib.Path('uploads/Ch2InstallationandConfigurationofAndroid.pdf')
file_path2 = pathlib.Path('uploads/Manual_CM6I_PWP_22616_120421.pdf')


sample_pdf_1 = client.files.upload(
  file=file_path,
  config=dict(mime_type='application/pdf')
)
sample_pdf_2 = client.files.upload(
  file=file_path2,
  config=dict(mime_type='application/pdf')
)
system_instruction="You are an expert analyzing transcripts,expert explainer and teacher,always answer form pdf document,when you answer please refer to the pdf document,also state the page number and topic name form where you are answering"

cache = client.caches.create(
    model=model_name,
    config=types.CreateCachedContentConfig(
      system_instruction=system_instruction,
      contents=[sample_pdf_1], # The document(s) and other content you wish to cache
    )
)

print("Enter 'exit' to quit the program")

while True:
  input_text = input("Enter the prompt: ")
  if input_text == "exit":
    break
  prompt = input_text
  response = client.models.generate_content(
    model=model_name,
    config=types.GenerateContentConfig(
    cached_content=cache.name
  ),
    contents=[sample_pdf_1, sample_pdf_2, prompt])
  print("\n"+response.text+"\n\n")

client.caches.delete(name = cache.name)
client.files.delete(name=sample_pdf_1.name)
client.files.delete(name=sample_pdf_2.name)



