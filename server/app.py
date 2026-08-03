from flask import jsonify
from config import app
   
@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello, World!'})
 
if __name__ == '__main__':
   app.run(debug=True, port=5555)