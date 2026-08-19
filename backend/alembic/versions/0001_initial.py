"""create fintrack tables"""
from alembic import op
import sqlalchemy as sa

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('categories', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('name', sa.String(80), nullable=False), sa.Column('color', sa.String(7), nullable=False), sa.Column('icon', sa.String(50), nullable=False), sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False), sa.UniqueConstraint('name'))
    op.create_index('ix_categories_name', 'categories', ['name'])
    op.create_table('transactions', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('description', sa.String(160), nullable=False), sa.Column('amount', sa.Numeric(12,2), nullable=False), sa.Column('type', sa.Enum('INCOME','EXPENSE',name='transactiontype'), nullable=False), sa.Column('category_id', sa.Integer(), sa.ForeignKey('categories.id'), nullable=False), sa.Column('date', sa.Date(), nullable=False), sa.Column('notes', sa.Text(), nullable=True), sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False), sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False))
    op.create_index('ix_transactions_category_id', 'transactions', ['category_id']); op.create_index('ix_transactions_date', 'transactions', ['date']); op.create_index('ix_transactions_description', 'transactions', ['description'])
    op.create_table('budgets', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('category_id', sa.Integer(), sa.ForeignKey('categories.id'), nullable=False), sa.Column('amount', sa.Numeric(12,2), nullable=False), sa.Column('month', sa.Date(), nullable=False), sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False), sa.UniqueConstraint('category_id','month',name='uq_budget_category_month'))
def downgrade():
    op.drop_table('budgets'); op.drop_table('transactions'); op.drop_table('categories')
