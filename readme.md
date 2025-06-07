python -m venv linkeenv  
linkeenv\Scripts\activate                                
pip install uv                                                                               
uv sync
uv run python .\backend\main.py


npx create-react-app landing-page
cd linkepuc
npm start

(linkeenv) PS C:\Users\Miguel\Documents\tcc\linkepuc\backend> uv run python -m services.fetch_cbctc_content