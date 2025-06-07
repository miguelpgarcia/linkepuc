import pdfplumber
import pandas as pd



# Função para separar o código da disciplina e o nome de forma robusta
def separar_codigo_nome(disciplina_str):
    # Verifica se existe o caractere ' - ' para separação
    if ' - ' in disciplina_str:
        return disciplina_str.split(' - ', 1)
    else:
        # Tenta separar no primeiro espaço como fallback, supondo que o código tenha letras e números
        for i, char in enumerate(disciplina_str):
            if char == '-':
                return disciplina_str[:i].strip(), disciplina_str[i+1:].strip()
        # Se tudo falhar, retorna a string como nome sem código (caso especial)
        return '', disciplina_str.strip()

# Define the path to your PDF file
pdf_path = 'historicoPuc2.pdf'

# Initialize an empty list to store the rows of the table
data = []

current_period = None


# Open the PDF file
with pdfplumber.open(pdf_path) as pdf:
    # Iterate over each page in the PDF
    for page in pdf.pages:
        # Extract the table on the page
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                if row[0] and row[0].startswith("20"):  # Supondo que o 'Período' comece com ano (ex: 20212)
                    current_period = row[0]  # Armazena o novo período
                    codigo_disciplina, nome_disciplina = separar_codigo_nome(row[1])
                    turma = row[2]
                    grau = row[3]
                    situacao = row[4]
                    n_cred = row[7]
                    # Adiciona a linha na lista
                    data.append([current_period, codigo_disciplina, nome_disciplina, turma, grau, situacao, n_cred])
                # Verifica se é uma linha de disciplina sem período (período já registrado)
                elif row[0] == '' and current_period:
                    codigo_disciplina, nome_disciplina = separar_codigo_nome(row[1])
                    turma = row[2]
                    grau = row[3]
                    situacao = row[4]
                    n_cred = row[7]
                    # Adiciona a linha na lista com o período atual
                    data.append([current_period, codigo_disciplina, nome_disciplina, turma, grau, situacao, n_cred])

# Convert the list into a pandas DataFrame
df = pd.DataFrame(data, columns=['Período', 'Cod_Disciplina', 'Nome_Disciplina', 'Turma', 'Grau', 'Situação', 'Nº Créditos'])

# Show the DataFrame
print(df)

# You can also save it to a CSV file if needed
df.to_csv('historico_academico.csv', index=False)
