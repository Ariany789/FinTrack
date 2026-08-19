import os
from uuid import uuid4

os.environ["DATABASE_URL"] = "sqlite:///./test_fintrack.db"

from fastapi.testclient import TestClient

from app.database.database import Base, engine
from app.main import app

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(engine)
def test_health(): assert client.get('/api/v1/health').json() == {'status':'ok'}
def test_categories_and_transaction():
    category = client.post('/api/v1/categories', json={'name':f'Teste API {uuid4().hex}','color':'#39FF88','icon':'tag'}).json()
    response = client.post('/api/v1/transactions', json={'description':'Transação teste','amount':'12.50','type':'EXPENSE','category_id':category['id'],'date':'2026-08-17'})
    assert response.status_code == 201
    assert client.get('/api/v1/transactions').json()['total'] >= 1
    assert client.delete(f"/api/v1/transactions/{response.json()['id']}").status_code == 204
    assert client.delete(f"/api/v1/categories/{category['id']}").status_code == 204
