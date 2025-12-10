# environment_test.py
from flask import Flask
import sys

app = Flask(__name__)

@app.route('/')
def hello():
    return "Environment is working!"

if __name__ == '__main__':
    # 打印当前使用的 Python 版本，确保是你预期的那个
    print(f"Current Python Version: {sys.version}")
    print("Starting Flask server verification...")
    # 运行在 5000 端口
    app.run(port=5000)