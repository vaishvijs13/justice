import os
import re
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from transcribe import TranscribeModel

load_dotenv()

pinecone_client = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

index_name = os.getenv("PINECONE_INDEX_NAME")
if index_name not in pinecone_client.list_indexes().names():
    pinecone_client.create_index(
        name=index_name,
        dimension=1536,
        metric='cosine',
        spec=ServerlessSpec(
            cloud="aws",
            region=os.getenv("PINECONE_REGION", "us-east-1")
        )
    )

embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

vectorstore = Pinecone(
    pinecone_client.Index(index_name),
    embedding=embeddings,
    text_key="text"
)
transcribe_model = TranscribeModel(model_size="small.en")

def clean_text(text):
    text = text.strip()  # remove leading and trailing whitespace
    text = re.sub(r'\s+', ' ', text)  # replace multiple spaces with a single space
    text = re.sub(r'[^\w\s.,!?\'\"-]', '', text)  # remove unwanted special characters
    text = text.replace('\n', ' ')  # replace newlines with spaces
    return text

def split(text):
    clean = clean_text(text)
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    return splitter.split_text(clean)

def to_pinecone(text, video_filename):
    print(f"Adding text to Pinecone vector store for {video_filename}")
    chunks = split(text)
    vectorstore.add_texts(texts=chunks, metadatas=[{'video_filename': video_filename}] * len(chunks)) # might need to use local model instead of openAI bc of usage limits (still using openAI rn)

def process(vid_path):
    clips = transcribe_model.process_video(vid_path)

    for clip in clips:
        video_filename = clip["video_path"]
        text = clip["text"]
        to_pinecone(text, video_filename)

def search_similar(query, top_k=3):
    """semantic search on pinecone; return the top_k similar video clips"""
    retriever = vectorstore.as_retriever(search_kwargs={"k": top_k})

    docs = retriever.get_relevant_documents(query)

    video_clips = []
    for doc in docs:
        video_clip_info = doc.metadata
        video_clips.append({
            'video_filename': video_clip_info.get('video_filename'),
            'text': doc.page_content,
            'clip_path': video_clip_info.get('video_filename')
        })

    return video_clips