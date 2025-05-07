import sys
import os
# Add the project root (one level up) to sys.path to allow backend package imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from backend.models.disciplinas import Disciplina, Base
from backend.models.base import SessionLocal
from sqlalchemy.orm import sessionmaker  # new import for sessionmaker


session = SessionLocal()

# Set up options for Edge (non-headless)
edge_options = Options()
# Remove the --headless argument to allow the browser to open with a GUI
edge_options.add_argument("--no-sandbox")

# Set up WebDriver for Edge using EdgeChromiumDriverManager
driver_service = EdgeService(EdgeChromiumDriverManager().install())
driver = webdriver.Edge(service=driver_service, options=edge_options)

# URL of the page to open
url = "https://microhorario.rdc.puc-rio.br/WebMicroHorarioConsulta/MicroHorarioConsulta.aspx?sessao=U2lzdGVtYT1QVUNPTkxJTkVfQUxVTk8mQXBsaWNhY2FvPU1JQ1JPX0hPUkFSSU8mRnVuY2FvPUNPTlNVTFRBJklEPTAyMDAwNDlkZWM4YzQxYmQ4YTAzNGI0ZDU1YTM1MjEz"

# Open the URL
driver.get(url)

# Wait for the page to load
sleep(3)

# Get period from the label (e.g. "Horário das Disciplinas ... - 2025.1")
period_text = driver.find_element(By.ID, "lblNomeAplicacao").text
periodo = period_text.split('-')[-1].strip()

# Find the button by its ID and click it
button = driver.find_element(By.ID, "btnBuscar")
button.click()

# Wait for the table to be present again after the button click
wait = WebDriverWait(driver, 10)

current_page = 1  # Track the current page number

while True:
    # Wait for the table to load
    table = wait.until(EC.presence_of_element_located((By.TAG_NAME, 'table')))
    rows = table.find_elements(By.TAG_NAME, 'tr')

    # Extract data from each row and add discipline if it doesn't exist
    for row in rows:
        try:
            session.rollback()  # new: reset session state before processing each row
            codigo = row.find_element(By.CLASS_NAME, 'col_Disciplina')
            nome = row.find_element(By.CLASS_NAME, 'col_Nomedadisciplina')
            professor = row.find_element(By.CLASS_NAME, 'col_Professor')
            horario = row.find_element(By.CLASS_NAME, 'col_HorarioSala')
            departamento = row.find_element(By.CLASS_NAME, 'col_Depto')
            creditos = row.find_element(By.CLASS_NAME, 'col_Cred')
            horas_a_distancia = row.find_element(By.CLASS_NAME, 'col_HorasaDistancia')
            shf = row.find_element(By.CLASS_NAME, 'col_SHF')

            # Print the discipline code and name
            result = f"{codigo.text.strip()} - {nome.text.strip()} - {professor.text.strip()} - {horario.text.strip()} - {departamento.text.strip()} - {creditos.text.strip()} - {horas_a_distancia.text.strip()} - {shf.text.strip()}"
            print(result)

            # Check if a discipline with the same codigo already exists in DB
            codigo_val = codigo.text.strip()
            # Print debug if record already exists
            existing = session.query(Disciplina).filter(Disciplina.codigo == codigo_val).first()
            if existing:
                print(f"Record with codigo {codigo_val} already exists.")
            else:
                new_disciplina = Disciplina(
                    codigo=codigo_val,
                    nome=nome.text.strip(),
                    professor=professor.text.strip(),
                    horario=horario.text.strip(),
                    departamento=departamento.text.strip(),
                    creditos=int(creditos.text.strip()) if creditos.text.strip().isdigit() else 0,
                    horas_a_distancia=int(horas_a_distancia.text.strip()) if horas_a_distancia.text.strip().isdigit() else 0,
                    shf=int(shf.text.strip()) if shf.text.strip().isdigit() else 0,
                    periodo=periodo
                )
                session.add(new_disciplina)
                try:
                    session.commit()
                    print(f"Inserted record with codigo {codigo_val}.")
                except Exception as db_e:
                    session.rollback()
                    print(f"Error committing record {codigo_val}: {db_e}")
        except Exception as e:
            print(f"Error processing row: {e}")
            continue

    # Check for the next page link
    try:
        # Find all pagination links
        pagination_links = driver.find_elements(By.XPATH, "//a[contains(@href, 'javascript:__doPostBack')]")
        print("Available pagination links:")
        for link in pagination_links:
            print(link.get_attribute('href'))

        # Find the next page link by matching the current page + 1
        next_page = None
        for link in pagination_links:
            href = link.get_attribute('href')
            if f"Page${current_page + 1}" in href:
                next_page = link
                break

        if next_page:
            print(f"Clicking on pagination link: {next_page.text}")

            # Extract the event target and argument from the href
            href = next_page.get_attribute('href')
            event_target = href.split("'")[1]
            event_argument = href.split("'")[3]

            # Set the hidden fields for __doPostBack
            driver.execute_script(f"document.getElementById('__EVENTTARGET').value = '{event_target}';")
            driver.execute_script(f"document.getElementById('__EVENTARGUMENT').value = '{event_argument}';")

            # Submit the form
            driver.execute_script("document.forms['form1'].submit();")
            sleep(2)  # Wait for the next page to load

            # Increment the current page number
            current_page += 1
        else:
            print("No more pages to load.")
            break
    except Exception as e:
        print(f"Error during pagination: {e}")
        break

# Close the browser window after viewing
driver.quit()
