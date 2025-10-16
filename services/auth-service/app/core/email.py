import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

MAIL_SERVER = os.getenv('MAIL_SERVER')
MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
MAIL_USERNAME = os.getenv('MAIL_USERNAME')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
MAIL_FROM = os.getenv('MAIL_FROM')

async def send_email_async(to: str, subject: str, html_body: str):
    """
    Envía un correo electrónico de forma asíncrona usando smtplib.
    """
    if not all([MAIL_SERVER, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM]):
        # En un entorno de producción, esto debería ser logueado, no impreso.
        print("Advertencia: Faltan variables de entorno para la configuración del correo. El correo no será enviado.")
        # No lanzar una excepción para permitir que el registro funcione en desarrollo sin configurar email.
        return

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = MAIL_FROM
    message["To"] = to

    # Adjunta el cuerpo HTML
    part = MIMEText(html_body, "html")
    message.attach(part)

    # Usar with para asegurar que la conexión se cierre automáticamente
    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
        server.starttls()  # Inicia la conexión segura
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_FROM, to, message.as_string())