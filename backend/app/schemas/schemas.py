from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.entities import TransactionType


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    color: str = Field(default="#39FF88", pattern=r"^#[0-9A-Fa-f]{6}$")
    icon: str = Field(default="tag", max_length=50)


class CategoryCreate(CategoryBase): pass
class CategoryUpdate(CategoryBase): pass
class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TransactionBase(BaseModel):
    description: str = Field(min_length=1, max_length=160)
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    type: TransactionType
    category_id: int
    date: date
    notes: str | None = Field(default=None, max_length=1000)


class TransactionCreate(TransactionBase): pass
class TransactionUpdate(TransactionBase): pass
class TransactionOut(TransactionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryOut
    model_config = ConfigDict(from_attributes=True)


class TransactionPage(BaseModel):
    items: list[TransactionOut]
    total: int
    page: int
    page_size: int
    total_pages: int


class BudgetBase(BaseModel):
    category_id: int
    amount: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    month: date

    @field_validator("month")
    @classmethod
    def month_starts_first_day(cls, value: date) -> date:
        return value.replace(day=1)


class BudgetCreate(BudgetBase): pass
class BudgetUpdate(BudgetBase): pass
class BudgetOut(BudgetBase):
    id: int
    category: CategoryOut
    used: Decimal = Decimal("0")
    remaining: Decimal = Decimal("0")
    percentage: float = 0
    status: str = "normal"
    model_config = ConfigDict(from_attributes=True)


class SalaryUpdate(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
