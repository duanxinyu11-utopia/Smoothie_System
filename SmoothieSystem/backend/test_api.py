# backend/test_api.py
import pytest
import json
import sys
import os

# 这一步是为了让测试脚本能找到 app.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app


# --- 1. 测试前的准备 (Fixture) ---
@pytest.fixture
def client():
    app.config['TESTING'] = True
    # 使用临时数据库或内存数据库会更安全，但在演示中我们直接用当前环境
    with app.test_client() as client:
        yield client


# --- 2. 测试菜单接口 (Menu Test) ---
def test_get_menu(client):
    print("\nExecuting Test: Get Menu...")
    response = client.get('/api/menu')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    print(f"✅ Menu Test Passed! Found {len(data)} items.")


# --- 3. 测试用户注册 (User Test) ---
def test_register_user(client):
    print("\nExecuting Test: User Registration...")
    import random
    # 随机生成邮箱避免重复
    rand_id = random.randint(10000, 99999)
    payload = {
        "email": f"test{rand_id}@example.com",
        "password": "password123"
    }
    response = client.post('/api/users/register',
                           data=json.dumps(payload),
                           content_type='application/json')
    assert response.status_code == 201
    print("✅ Registration Test Passed!")


# --- 4. 测试下单流程 (Order Test) ---
def test_place_order(client):
    print("\nExecuting Test: Place Order...")
    payload = {
        "user_id": 1,
        "total_price": 12.50,
        "items": []
    }
    response = client.post('/api/orders',
                           data=json.dumps(payload),
                           content_type='application/json')

    assert response.status_code == 201
    data = json.loads(response.data)
    assert "order_id" in data
    print(f"✅ Order Test Passed! Order ID: {data['order_id']}")