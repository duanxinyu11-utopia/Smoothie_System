import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
#允许跨域，前端运行在 localhost:3000，后端在 localhost:5000


# --- 数据库配置 ---
def init_db():
    conn = sqlite3.connect('smoothie.db')
    c = conn.cursor()
    # 1. 现有表
    #
    c.execute('''CREATE TABLE IF NOT EXISTS menu 
                 (id INTEGER PRIMARY KEY, name TEXT, price REAL, image TEXT, description TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS orders 
                 (id INTEGER PRIMARY KEY, user_id TEXT, total_price REAL, status TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, name TEXT)''')

    # 2. [新增] 确保 Notifications 表存在
    # 字段：id, user_id, message, timestamp (时间)
    c.execute('''CREATE TABLE IF NOT EXISTS notifications 
                 (id INTEGER PRIMARY KEY, user_id TEXT, message TEXT, timestamp TEXT)''')

    # 插入初始菜单
    c.execute('SELECT count(*) FROM menu')
    if c.fetchone()[0] == 0:
        initial_items = [
            (1, "Berry Blast", 5.99, "/Berry.png", "Rich in antioxidants"),
            (2, "Mango Tango", 6.50, "/Mango.png", "Tropical delight"),
            (3, "Green Detox", 7.00, "/Green.png", "Spinach and apple")
        ]
        c.executemany('INSERT INTO menu VALUES (?,?,?,?,?)', initial_items)
        conn.commit()
    conn.close()


init_db()


# --- 现有接口 ---
#前端 React 页面加载时调用此接口。
#它从 menu 表里查出所有数据，转换成 JSON 格式发给前端。
@app.route('/api/menu', methods=['GET'])
def get_menu():
    conn = sqlite3.connect('smoothie.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM menu')
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json
    user_id = data.get('user_id', 'guest')
    total_price = data.get('total_price')

    conn = sqlite3.connect('smoothie.db')
    c = conn.cursor()

    # 1. 创建订单
    c.execute("INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)",
              (user_id, total_price, 'Pending'))
    new_order_id = c.lastrowid

    # 2. [新增] 自动发送一条通知
    message = f"Order #{new_order_id} confirmed! Total: ${total_price}"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    c.execute("INSERT INTO notifications (user_id, message, timestamp) VALUES (?, ?, ?)",
              (user_id, message, timestamp))

    conn.commit()
    conn.close()
    return jsonify({"message": "Order placed!", "order_id": new_order_id}), 201


# --- 用户接口 ---
#如果邮箱重复，数据库会报错
@app.route('/api/users/register', methods=['POST'])
def register():
    data = request.json
    try:
        conn = sqlite3.connect('smoothie.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
                  (data.get('email'), data.get('password'), 'User'))
        conn.commit()
        conn.close()
        return jsonify({"message": "Registration successful!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400

#用 SELECT 去数据库比对。如果找得到人且密码对，就返回成功
@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.json
    conn = sqlite3.connect('smoothie.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=? AND password=?", (data.get('email'), data.get('password')))
    user = c.fetchone()
    conn.close()
    #
    if user:
        return jsonify({"message": "Login successful", "user_id": user['id'], "name": user['email']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route('/api/orders/user/<user_id>', methods=['GET'])
def get_user_orders(user_id):
    conn = sqlite3.connect('smoothie.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM orders WHERE user_id = ?', (user_id,))
    rows = c.fetchall()
    conn.close()
    if not rows: return jsonify([])
    return jsonify([dict(row) for row in rows])


# --- [新增] 获取通知接口 ---
@app.route('/api/notifications/<user_id>', methods=['GET'])
def get_notifications(user_id):
    conn = sqlite3.connect('smoothie.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    # 按时间倒序排列，最新的在最上面
    c.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC', (user_id,))
    rows = c.fetchall()
    conn.close()
    if not rows: return jsonify([])
    return jsonify([dict(row) for row in rows])


if __name__ == '__main__':
    app.run(port=5000, debug=True)