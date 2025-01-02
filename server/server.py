from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from embeddings import process, search_similar

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({'message': 'not relevant route'}), 200

# transcribe and index the video
@app.route('/process', methods=['POST'])
def process_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400

    video = request.files['video']
    video_filename = video.filename

    if not video_filename:
        return jsonify({'error': 'Invalid video file'}), 400

    temp_path = os.path.join(UPLOAD_FOLDER, video_filename)
    video.save(temp_path)

    try:
        process(temp_path)
        return jsonify({'message': 'Video processed and indexed successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# perform semantic search on the videos uploaded
@app.route('/search', methods=['GET'])
def search_videos():
    query = request.args.get('query')
    top_k = int(request.args.get('top_k', 5))

    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        results = search_similar(query, top_k=top_k)
        response = [
            {
                'video_filename': result['video_filename'],
                'text_snippet': result['text']
            }
            for result in results
        ]
        return jsonify({'results': response}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)