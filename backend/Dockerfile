FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Define onde o Playwright vai baixar os navegadores para não ficar na pasta /root oculta
ENV PLAYWRIGHT_BROWSERS_PATH=/playwright-browsers

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instala o Chromium e suas dependências de sistema (isso precisa ser feito como root)
RUN playwright install --with-deps chromium

# Cria um usuário seguro chamado 'appuser'
RUN useradd -m appuser

COPY . .

# Passa a propriedade da pasta do app e dos navegadores para o 'appuser'
RUN chown -R appuser:appuser /app && \
    chown -R appuser:appuser /playwright-browsers

# Daqui pra baixo, o container roda com esse usuário seguro, resolvendo o aviso do Celery!
USER appuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]