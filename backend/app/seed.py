from datetime import date, timedelta
from decimal import Decimal

from app.database.database import Base, SessionLocal, engine
from app.models.entities import Budget, Category, Transaction, TransactionType

CATEGORIES = [("Moradia", "#60A5FA", "house"), ("Alimentação", "#F59E0B", "utensils"), ("Transporte", "#A78BFA", "car"), ("Lazer", "#EC4899", "gamepad-2"), ("Saúde", "#FB7185", "heart-pulse"), ("Educação", "#22C55E", "graduation-cap"), ("Compras", "#38BDF8", "shopping-bag"), ("Assinaturas", "#F97316", "tv"), ("Outros", "#94A3B8", "circle")]

def main():
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        if db.query(Category).count(): print("Seed ignorado: já existem dados."); return
        category_map = {name: Category(name=name, color=color, icon=icon) for name, color, icon in CATEGORIES}
        db.add_all(category_map.values()); db.flush()
        today = date.today()
        data = [("Salário", "5000.00", "INCOME", "Outros", 1), ("Freelance", "1200.00", "INCOME", "Outros", 5), ("Aluguel", "1450.00", "EXPENSE", "Moradia", 2), ("Mercado", "680.50", "EXPENSE", "Alimentação", 3), ("Internet", "119.90", "EXPENSE", "Moradia", 7), ("Streaming", "59.90", "EXPENSE", "Assinaturas", 10), ("Academia", "99.90", "EXPENSE", "Saúde", 4), ("Uber", "145.30", "EXPENSE", "Transporte", 8), ("Restaurante", "180.00", "EXPENSE", "Lazer", 6), ("Curso online", "129.90", "EXPENSE", "Educação", 12)]
        db.add_all(Transaction(description=name, amount=Decimal(amount), type=TransactionType(kind), category=category_map[category], date=today - timedelta(days=days)) for name, amount, kind, category, days in data)
        db.add_all(Budget(category=category_map[name], amount=Decimal(amount), month=today.replace(day=1)) for name, amount in [("Alimentação", "800"), ("Transporte", "500"), ("Lazer", "300")])
        db.commit(); print("Dados demonstrativos criados.")
    finally: db.close()

if __name__ == "__main__": main()
