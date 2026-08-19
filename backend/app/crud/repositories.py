from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.entities import Budget, Category, Transaction, TransactionType


class CategoryRepository:
    def list(self, db: Session): return db.scalars(select(Category).order_by(Category.name)).all()
    def get(self, db: Session, item_id: int): return db.get(Category, item_id)
    def by_name(self, db: Session, name: str): return db.scalar(select(Category).where(func.lower(Category.name) == name.lower()))
    def save(self, db: Session, item: Category): db.add(item); db.commit(); db.refresh(item); return item
    def delete(self, db: Session, item: Category): db.delete(item); db.commit()


class TransactionRepository:
    def get(self, db: Session, item_id: int):
        return db.scalar(select(Transaction).options(joinedload(Transaction.category)).where(Transaction.id == item_id))

    def list(self, db: Session, *, page: int, page_size: int, transaction_type: TransactionType | None, category_id: int | None, start_date: date | None, end_date: date | None, min_amount: float | None, max_amount: float | None, search: str | None, sort: str):
        query = select(Transaction).options(joinedload(Transaction.category))
        if transaction_type: query = query.where(Transaction.type == transaction_type)
        if category_id: query = query.where(Transaction.category_id == category_id)
        if start_date: query = query.where(Transaction.date >= start_date)
        if end_date: query = query.where(Transaction.date <= end_date)
        if min_amount is not None: query = query.where(Transaction.amount >= min_amount)
        if max_amount is not None: query = query.where(Transaction.amount <= max_amount)
        if search: query = query.where(Transaction.description.ilike(f"%{search}%"))
        total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
        order = {"oldest": Transaction.date.asc(), "highest": Transaction.amount.desc(), "lowest": Transaction.amount.asc()}.get(sort, Transaction.date.desc())
        return db.scalars(query.order_by(order, Transaction.id.desc()).offset((page - 1) * page_size).limit(page_size)).unique().all(), total

    def save(self, db: Session, item: Transaction): db.add(item); db.commit(); db.refresh(item); return self.get(db, item.id)
    def delete(self, db: Session, item: Transaction): db.delete(item); db.commit()


class BudgetRepository:
    def list(self, db: Session, month: date): return db.scalars(select(Budget).options(joinedload(Budget.category)).where(Budget.month == month)).unique().all()
    def get(self, db: Session, item_id: int): return db.scalar(select(Budget).options(joinedload(Budget.category)).where(Budget.id == item_id))
    def save(self, db: Session, item: Budget): db.add(item); db.commit(); db.refresh(item); return self.get(db, item.id)
    def delete(self, db: Session, item: Budget): db.delete(item); db.commit()
