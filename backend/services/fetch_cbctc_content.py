import requests
from bs4 import BeautifulSoup
import pandas as pd
from sqlalchemy.orm import Session
from controllers.user_controller import user_router
from controllers.interesse_controller import interesse_router
from controllers.vaga_controller import vaga_router
from controllers.interesse_usuario_controller import interesse_usuario_router
from controllers.publicacao_controller import publicacao_router
from controllers.department_controller import departamento_router
from models.disciplinas import Disciplina
from models.base import SessionLocal
from repositories.vaga_repository import create_vaga
from repositories.department_repository import get_department_id_by_name
import os
from openai import OpenAI

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db = next(get_db())

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fetch_cbctc_content():
    url = "https://www.cbctc.puc-rio.br/Pagina.aspx?id=743"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for HTTP errors
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Extract the "periodo" from the <title> tag
        title = soup.find("title").get_text(strip=True)
        periodo = title.split(" ")[-1]  # Extract the last part (e.g., "2025.1")
        
        # Locate the table with id="tbl_disciplinas" and extract rows
        table = soup.find("table", {"id": "tbl_disciplinas"})
        rows = table.find_all("tr")
        prazo = get_prazo(response.text)  # Extract the prazo from the response text
        table_categoria = soup.find("table", {"id": "categorias"})  # Locate the table by its ID
        rows_categoria = table_categoria.find_all("tr")  # Get all rows in the table

        for row in rows_categoria:
            cols = row.find_all("td")
            if len(cols) > 0 and cols[0].get_text(strip=True) == "Inicial":
                # Extract and clean the values for Categoria A, B, and C
                print(cols[1].get_text(strip=True))
                remuneracao_a = int(cols[1].get_text(strip=True).replace("R$", "").replace(",", ".").split(".")[0])
                remuneracao_b = int(cols[2].get_text(strip=True).replace("R$", "").replace(",", ".").split(".")[0])
                remuneracao_c = int(cols[3].get_text(strip=True).replace("R$", "").replace(",", ".").split(".")[0])
        remuneracao_a = remuneracao_a if remuneracao_a else 0
        remuneracao_b = remuneracao_b if remuneracao_b else 0   
        remuneracao_c = remuneracao_c if remuneracao_c else 0
        print(f"Remuneração A: {remuneracao_a}, B: {remuneracao_b}, C: {remuneracao_c}")
        
        data = []
        for row in rows[1:]:  # Skip header row
            cols = row.find_all("td")
            if len(cols) == 5:  # Ensure the row has the expected number of columns
                disciplina_full = cols[0].get_text(strip=True)

                disciplina_parts = disciplina_full.split("-", 1)  # Split at the first "-"
                disciplina_codigo = disciplina_parts[0].strip()  # Remove any leading/trailing spaces
                disciplina_nome = disciplina_parts[1].strip() if len(disciplina_parts) > 1 else ""  # Handle cases where no name exists
                # Query the database for professor and horario
                disciplina_db = db.query(Disciplina).filter(
                    Disciplina.codigo == disciplina_codigo,
                    Disciplina.periodo == periodo
                ).first()

                professor = disciplina_db.professor if disciplina_db else "N/A"
                horario = disciplina_db.horario if disciplina_db else "N/A"
                id = disciplina_db.id if disciplina_db else None
                departamento = disciplina_db.departamento if disciplina_db else "N/A"

                data.append({
                    "disciplina_codigo": disciplina_codigo,
                    "disciplina_nome": disciplina_nome,
                    "categoria": cols[1].get_text(strip=True),
                    "ch": cols[2].get_text(strip=True),
                    "prof": cols[3].get_text(strip=True),
                    "correcao": cols[4].get_text(strip=True),
                    "periodo": periodo,  # Add the "periodo" column
                    "nome_professor": professor,
                    "horario": horario,
                    "id_disciplina": id,
                    "departamento": departamento,
                    "prazo": prazo,
                    "remuneracao_a": remuneracao_a,
                    "remuneracao_b": remuneracao_b,
                    "remuneracao_c": remuneracao_c
                })
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(data)
        df.to_csv("debug_output.txt", sep="\t", index=False)  # Save as a tab-separated file
        print(df)  # Display the DataFrame for debugging
        
        return df  # Return the DataFrame if needed elsewhere
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch content: {e}")

def process_monitorias_from_cbctc():
    # Fetch the content and get the DataFrame
    df = fetch_cbctc_content()

    # Loop through each row in the DataFrame
    for _, row in df.iterrows():
        # Extract data from the DataFrame row
        titulo = f"Monitoria em {row['disciplina_codigo']} - {row["disciplina_nome"]}"
        descricao = f"Monitoria - Categoria {row['categoria']} - {row['disciplina_codigo']} - {row['disciplina_nome']}"
        prazo = row["prazo"]  # Assuming prazo is already in DD-MM-YY format
        autor_id = 8  # Hardcoded author ID
        interesses = []  # Assuming no interests for now
        location_id = 1  # Default location (e.g., 1 = Remoto)
        department_name = row["departamento"]
        department_id =get_department_id_by_name(db, department_name)
        if row["categoria"] == "A":
            remuneracao = row["remuneracao_a"]
        elif row["categoria"] == "B":
            remuneracao = row["remuneracao_b"]
        else:
            remuneracao = row["remuneracao_c"]
        horas_complementares = 15
        desconto = None
        tipo_id = 1
        link_vaga = "https://www.cbctc.puc-rio.br/Pagina.aspx?id=743"
        professor = row["nome_professor"]

        # Call create_vaga
        vaga = create_vaga(
            db=db,
            titulo=titulo,
            descricao=descricao,
            prazo=prazo,
            autor_id=autor_id,
            interesses=interesses,
            location_id=location_id,
            department_id=department_id,
            remuneracao=remuneracao,
            horas_complementares=horas_complementares,
            desconto=desconto,
            tipo_id=tipo_id,
            link_vaga=link_vaga,
            professor=professor,
        )

        print(f"Vaga created: {vaga.titulo} (ID: {vaga.id})")

def extract_paragraph_with_target_string(body: str, target: str):
    """
    Extract the paragraph containing the target string from the email body.
    """
    paragraphs = body.split("\n\n")  # Split the body into paragraphs
    for paragraph in paragraphs:
        if target in paragraph:
            return paragraph.strip()
    return None

def get_prazo_from_paragraph(paragraph: str):
    """
    Send the paragraph to the LLM to extract the prazo in DD-MM-YY format.
    """
    prompt = f"""
Extract only the deadline (prazo) from the following paragraph in DD-MM-YY format. 
The paragraph may have a starting date and a deadline, but you should only return the deadline.
If no deadline is found, return null.
Your output should only be the single date in the specified format, without any additional text.

Paragraph:
{paragraph}
"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    content = response.choices[0].message.content.strip()
    return content if content.lower() != "null" else None


    

def get_prazo(body: str):
    target_string = "os coordenadores farão a primeira seleção de candidatos"
    paragraph = extract_paragraph_with_target_string(body, target_string)
    if paragraph:
        print("Target paragraph found:")
        print(paragraph)

        # Get the prazo from the paragraph
        prazo = get_prazo_from_paragraph(paragraph)
        if prazo:
            print(f"Extracted prazo: {prazo}")
            return prazo
        else:
            print("No prazo found in the paragraph.")
    else:
        print(f"No paragraph found containing the string: '{target_string}'")

    return None


def process_tepp_from_cbctc():
    url = "https://www.cbctc.puc-rio.br/Pagina.aspx?id=782"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for HTTP errors
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        print(text)

    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch content: {e}")
        return
if __name__ == "__main__":
    #process_monitorias_from_cbctc()
    process_tepp_from_cbctc()
