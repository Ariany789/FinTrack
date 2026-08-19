from calendar import monthrange
from datetime import date, timedelta
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models.entities import Budget, Category, Transaction, TransactionType


def require_category(db: Session, category_id: int) -> None:
    if not db.get(Category, category_id):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Categoria não encontrada.")


def date_range(period: str) -> tuple[date, date]:
    today = date.today()
    days = {"week": 6, "month": 30, "quarter": 90, "year": 365}.get(period, 30)
    return today - timedelta(days=days), today


def summary(db: Session, start: date | None = None, end: date | None = None) -> dict:
    start, end = start or date.today().replace(day=1), end or date.today()
    income, expense = db.execute(select(
        func.coalesce(func.sum(case((Transaction.type == TransactionType.INCOME, Transaction.amount), else_=0)), 0),
        func.coalesce(func.sum(case((Transaction.type == TransactionType.EXPENSE, Transaction.amount), else_=0)), 0),
    ).where(Transaction.date.between(start, end))).one()
    balance = income - expense
    return {"income": income, "expense": expense, "balance": balance, "savings_rate": round(float(balance / income * 100), 2) if income else 0}


def category_expenses(db: Session, start: date, end: date) -> list[dict]:
    rows = db.execute(select(Category.id, Category.name, Category.color, func.sum(Transaction.amount).label("amount")).join(Transaction).where(Transaction.type == TransactionType.EXPENSE, Transaction.date.between(start, end)).group_by(Category.id)).all()
    total = sum((row.amount for row in rows), Decimal("0"))
    return [{"id": row.id, "name": row.name, "color": row.color, "amount": row.amount, "percentage": round(float(row.amount / total * 100), 2) if total else 0} for row in rows]


def evolution(db: Session, period: str) -> list[dict]:
    start, end = date_range(period)
    rows = db.execute(select(Transaction.date, Transaction.type, func.sum(Transaction.amount)).where(Transaction.date.between(start, end)).group_by(Transaction.date, Transaction.type).order_by(Transaction.date)).all()
    values: dict[date, dict] = {}
    for item_date, item_type, amount in rows:
        values.setdefault(item_date, {"date": item_date, "income": Decimal("0"), "expense": Decimal("0")})["income" if item_type == TransactionType.INCOME else "expense"] = amount
    balance = Decimal("0")
    result = []
    for item in values.values():
        balance += item["income"] - item["expense"]
        result.append({**item, "balance": balance})
    return result


def budget_details(db: Session, budget: Budget) -> dict:
    end = date(budget.month.year, budget.month.month, monthrange(budget.month.year, budget.month.month)[1])
    used = db.scalar(select(func.coalesce(func.sum(Transaction.amount), 0)).where(Transaction.category_id == budget.category_id, Transaction.type == TransactionType.EXPENSE, Transaction.date.between(budget.month, end))) or Decimal("0")
    percentage = round(float(used / budget.amount * 100), 2) if budget.amount else 0
    return {"used": used, "remaining": budget.amount - used, "percentage": percentage, "status": "critical" if percentage > 90 else "attention" if percentage >= 70 else "normal"}


def insights(db: Session) -> list[dict]:
    current_start = date.today().replace(day=1)
    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end.replace(day=1)
    current = summary(db, current_start, date.today())
    previous = summary(db, previous_start, previous_end)
    messages = []
    if current["expense"] and previous["expense"]:
        change = (current["expense"] - previous["expense"]) / previous["expense"] * 100
        if abs(change) >= 5: messages.append({"type": "warning" if change > 0 else "positive", "message": f"Suas despesas {'aumentaram' if change > 0 else 'diminuíram'} {abs(change):.0f}% em relação ao mês anterior."})
    if current["income"]: messages.append({"type": "positive" if current["savings_rate"] >= 0 else "warning", "message": f"Você economizou {current['savings_rate']:.0f}% da sua receita neste período."})
    largest = db.execute(select(Category.name, func.sum(Transaction.amount).label("amount")).join(Transaction).where(Transaction.type == TransactionType.EXPENSE, Transaction.date.between(current_start, date.today())).group_by(Category.name).order_by(func.sum(Transaction.amount).desc()).limit(1)).first()
    if largest: messages.append({"type": "info", "message": f"Seu maior gasto neste mês foi {largest.name}."})
    return messages
