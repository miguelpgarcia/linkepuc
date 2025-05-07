import requests
from bs4 import BeautifulSoup
import pandas as pd

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
        
        # Extract data into a list of dictionaries
        data = []
        for row in rows[1:]:  # Skip header row
            cols = row.find_all("td")
            if len(cols) == 5:  # Ensure the row has the expected number of columns
                data.append({
                    "disciplina": cols[0].get_text(strip=True),
                    "categoria": cols[1].get_text(strip=True),
                    "ch": cols[2].get_text(strip=True),
                    "prof": cols[3].get_text(strip=True),
                    "correcao": cols[4].get_text(strip=True),
                })
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(data)
        df["periodo"] = periodo  # Add the "periodo" column to the DataFrame
        print(df)  # Display the DataFrame for debugging
        
        return df  # Return the DataFrame if needed elsewhere
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch content: {e}")

if __name__ == "__main__":
    fetch_cbctc_content()
