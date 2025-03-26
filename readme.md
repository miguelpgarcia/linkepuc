python -m venv linkeenv  
linkeenv\Scripts\activate                                
pip install uv                                                                               
uv sync
uv run python .\backend\main.py