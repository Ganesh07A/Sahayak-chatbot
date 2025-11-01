import requests

API_KEY = "AIzaSyDuNXCyuEBXpd1_EeUT3Omdv2KPyGWpfKE"
url = f"https://generativelanguage.googleapis.com/v1/models?key={API_KEY}"
response = requests.get(url)
print(response.status_code, response.text)
