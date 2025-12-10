# app.py - 冰沙系统后端 (Menu & Order Service)
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# 允许跨域请求，这样你的前端 React 才能访问这个后端
CORS(app)

# --- 模拟数据库数据 (Mock Data) ---
# 菜单数据：包含 ID, 名称, 价格, 图片链接
menu_items = [
    {"id": 1, "name": "Berry Blast", "price": 5.99, "image": "berry.jpg",
     "description": "Antioxidant rich blueberries and strawberries"},
    {"id": 2, "name": "Mango Tango", "price": 6.50, "image": "mango.jpg",
     "description": "Fresh mango with a hint of lime"},
    {"id": 3, "name": "Green Machine", "price": 7.00, "image": "green.jpg",
     "description": "Spinach, apple, and ginger detox"}
]

# 订单数据：暂时存在内存里，重启程序会清空
orders = []


# --- API 接口定义 ---

# 1. 欢迎接口 (测试用)
@app.route('/')
def home():
    return "Smoothie System Backend is Running!"


# 2. 获取菜单接口 (Menu Service)
# 前端会访问这里来显示有什么冰沙
@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(menu_items)


# 3. 下单接口 (Order Service)
# 前端点击"下单"时，会把数据发到这里
@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json

    # 简单的逻辑：创建一个新订单
    new_order = {
        "order_id": len(orders) + 1,
        "items": data.get('items'),  # 用户买了什么
        "total_price": data.get('total_price'),
        "status": "Pending",  # 初始状态：待处理
        "user_id": data.get('user_id', 'guest')  # 默认是 guest 用户
    }

    orders.append(new_order)
    print(f"收到新订单: {new_order}")  # 在控制台打印出来给你看

    return jsonify({
        "message": "Order placed successfully!",
        "order_id": new_order['order_id'],
        "status": new_order['status']
    }), 201


# --- 启动程序 ---
if __name__ == '__main__':
    # debug=True 表示如果你改了代码，它会自动重启，不用你手动停
    app.run(port=5000, debug=True)