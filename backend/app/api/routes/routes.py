from datetime import date
from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.crud.repositories import BudgetRepository, CategoryRepository, TransactionRepository
from app.database.database import get_db
from app.models.entities import Budget, Category, Transaction, TransactionType
from app.schemas.schemas import BudgetCreate, BudgetOut, BudgetUpdate, CategoryCreate, CategoryOut, CategoryUpdate, SalaryUpdate, TransactionCreate, TransactionOut, TransactionPage, TransactionUpdate
from app.services.finance_service import budget_details, category_expenses, evolution, insights, require_category, summary

router = APIRouter()
categories, transactions, budgets = CategoryRepository(), TransactionRepository(), BudgetRepository()


def missing(label: str): raise HTTPException(404, f"{label} não encontrado(a).")

@router.get("/health")
def health(): return {"status": "ok"}

@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)): return categories.list(db)
@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    if categories.by_name(db, data.name): raise HTTPException(409, "Já existe uma categoria com este nome.")
    return categories.save(db, Category(**data.model_dump()))
@router.put("/categories/{item_id}", response_model=CategoryOut)
def update_category(item_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    item = categories.get(db, item_id) or missing("Categoria")
    duplicate = categories.by_name(db, data.name)
    if duplicate and duplicate.id != item_id: raise HTTPException(409, "Já existe uma categoria com este nome.")
    for key, value in data.model_dump().items(): setattr(item, key, value)
    return categories.save(db, item)
@router.delete("/categories/{item_id}", status_code=204)
def delete_category(item_id: int, db: Session = Depends(get_db)):
    item = categories.get(db, item_id) or missing("Categoria")
    if item.transactions: raise HTTPException(409, "Não é possível excluir uma categoria que possui transações.")
    categories.delete(db, item); return Response(status_code=204)

@router.get("/transactions", response_model=TransactionPage)
def list_transactions(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100), type: TransactionType | None = None, category_id: int | None = None, start_date: date | None = None, end_date: date | None = None, min_amount: float | None = Query(None, ge=0), max_amount: float | None = Query(None, ge=0), search: str | None = None, sort: str = "recent", db: Session = Depends(get_db)):
    items, total = transactions.list(db, page=page, page_size=page_size, transaction_type=type, category_id=category_id, start_date=start_date, end_date=end_date, min_amount=min_amount, max_amount=max_amount, search=search, sort=sort)
    return {"items": items, "total": total, "page": page, "page_size": page_size, "total_pages": ceil(total / page_size) if total else 0}
@router.get("/transactions/{item_id}", response_model=TransactionOut)
def get_transaction(item_id: int, db: Session = Depends(get_db)): return transactions.get(db, item_id) or missing("Transação")
@router.post("/transactions", response_model=TransactionOut, status_code=201)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    require_category(db, data.category_id); return transactions.save(db, Transaction(**data.model_dump()))
@router.put("/transactions/{item_id}", response_model=TransactionOut)
def update_transaction(item_id: int, data: TransactionUpdate, db: Session = Depends(get_db)):
    item = transactions.get(db, item_id) or missing("Transação"); require_category(db, data.category_id)
    for key, value in data.model_dump().items(): setattr(item, key, value)
    return transactions.save(db, item)
@router.delete("/transactions/{item_id}", status_code=204)
def delete_transaction(item_id: int, db: Session = Depends(get_db)):
    item = transactions.get(db, item_id) or missing("Transação"); transactions.delete(db, item); return Response(status_code=204)

@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)): return summary(db)
@router.get("/dashboard/evolution")
def dashboard_evolution(period: str = Query("month", pattern="^(week|month|quarter|year)$"), db: Session = Depends(get_db)): return evolution(db, period)
@router.get("/dashboard/categories")
def dashboard_categories(db: Session = Depends(get_db)): return category_expenses(db, date.today().replace(day=1), date.today())
@router.get("/dashboard/recent-transactions", response_model=list[TransactionOut])
def recent_transactions(db: Session = Depends(get_db)): return transactions.list(db, page=1, page_size=5, transaction_type=None, category_id=None, start_date=None, end_date=None, min_amount=None, max_amount=None, search=None, sort="recent")[0]
@router.put("/dashboard/salary", response_model=TransactionOut)
def set_monthly_salary(data: SalaryUpdate, db: Session = Depends(get_db)):
    today = date.today()
    category = categories.by_name(db, "Outros")
    if not category:
        raise HTTPException(422, "A categoria Outros é necessária para registrar o salário.")
    salary = db.scalar(select(Transaction).where(Transaction.type == TransactionType.INCOME, func.lower(Transaction.description) == "salário", Transaction.date.between(today.replace(day=1), today)).order_by(Transaction.date.desc()))
    if salary:
        salary.amount = data.amount
        salary.date = today
        return transactions.save(db, salary)
    return transactions.save(db, Transaction(description="Salário", amount=data.amount, type=TransactionType.INCOME, category_id=category.id, date=today, notes="Salário mensal"))

@router.get("/budgets", response_model=list[BudgetOut])
def list_budgets(month: date = Query(default_factory=lambda: date.today().replace(day=1)), db: Session = Depends(get_db)):
    return [{**BudgetOut.model_validate(item).model_dump(), **budget_details(db, item)} for item in budgets.list(db, month.replace(day=1))]
@router.post("/budgets", response_model=BudgetOut, status_code=201)
def create_budget(data: BudgetCreate, db: Session = Depends(get_db)):
    require_category(db, data.category_id); item = budgets.save(db, Budget(**data.model_dump())); return {**BudgetOut.model_validate(item).model_dump(), **budget_details(db, item)}
@router.put("/budgets/{item_id}", response_model=BudgetOut)
def update_budget(item_id: int, data: BudgetUpdate, db: Session = Depends(get_db)):
    item = budgets.get(db, item_id) or missing("Orçamento"); require_category(db, data.category_id)
    for key, value in data.model_dump().items(): setattr(item, key, value)
    item = budgets.save(db, item); return {**BudgetOut.model_validate(item).model_dump(), **budget_details(db, item)}
@router.delete("/budgets/{item_id}", status_code=204)
def delete_budget(item_id: int, db: Session = Depends(get_db)):
    item = budgets.get(db, item_id) or missing("Orçamento"); budgets.delete(db, item); return Response(status_code=204)

@router.get("/reports/summary")
def report_summary(start_date: date | None = None, end_date: date | None = None, db: Session = Depends(get_db)): return summary(db, start_date, end_date)
@router.get("/reports/categories")
def report_categories(start_date: date | None = None, end_date: date | None = None, db: Session = Depends(get_db)): return category_expenses(db, start_date or date.today().replace(day=1), end_date or date.today())
@router.get("/reports/evolution")
def report_evolution(period: str = "year", db: Session = Depends(get_db)): return evolution(db, period)
@router.get("/insights")
def list_insights(db: Session = Depends(get_db)): return insights(db)
