"""
Add carta_motivacao field to candidato_vaga table

Revision ID: add_carta_motivacao
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'add_carta_motivacao'
down_revision = None
depends_on = None

def upgrade():
    # Add carta_motivacao column to candidato_vaga table
    op.add_column('candidato_vaga', sa.Column('carta_motivacao', sa.Text(), nullable=True))

def downgrade():
    # Remove carta_motivacao column from candidato_vaga table
    op.drop_column('candidato_vaga', 'carta_motivacao') 