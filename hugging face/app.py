# app.py — HuggingFace Spaces এর main file 
# app.py — HuggingFace Spaces এর main file
import os
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.language_models.llms import LLM
import gradio as gr
from typing import Optional, List, Any

# ── Model Load ────────────────────────────────────
model_name = 'Qwen/Qwen2.5-1.5B-Instruct'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name, torch_dtype=torch.float16, device_map='auto'
)
pipe = pipeline('text-generation', model=model, tokenizer=tokenizer)

# ── Document Load — PDF টা Space এ upload কেরা ──
# HuggingFace Spaces এ file upload করা যায় Files tab থেক
loader = PyPDFLoader('Sake_Chatbot_Training_Document.pdf')

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800, chunk_overlap=100,
    separators=['\n\nQ:', '\n\nA:', '\n\n', '\n', ' ']
)
docs = loader.load()
chunks = splitter.split_documents(docs)

embeddings = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2'
)
vectorstore = FAISS.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(
    search_type='mmr',
    search_kwargs={'k': 4, 'fetch_k': 20, 'lambda_mult': 0.7}
)

# ── RAG + Chat (Colab এর Cell 4 এর মেতাই) ─────
GREETINGS = ['hello', 'hi', 'hey']
STOP_PATTERNS = ['Question:', 'Context:', 'Q:', 'Note:', 'Task:']


def clean_output(text):
    for p in STOP_PATTERNS:
        if p in text: text = text.split(p)[0].strip()
    return text.strip('.-• \n')


def chat(message, history):
    if message.strip().lower() in GREETINGS:
        return 'Hello! I am the Sake Brewing IoT Assistant.'
    docs = retriever.invoke(message)
    context = '\n\n'.join([d.page_content for d in docs])
    messages = [
        {'role': 'system', 'content': 'Answer using ONLY the context. Be'
                                      'concise.'},
        {'role': 'user', 'content': f'Context:\n{context}\n\nQuestion: {message}'}
    ]
    prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    raw = pipe(prompt, max_new_tokens=120, do_sample=False,
               repetition_penalty=1.2,
               pad_token_id=tokenizer.eos_token_id)[0]['generated_text']
    return clean_output(raw[len(prompt):].strip())


# ── Gradio UI ─────────────────────────────────────
gr.ChatInterface(
    fn=chat, title='Sake Brewing IoT Chatbot',
).launch()
