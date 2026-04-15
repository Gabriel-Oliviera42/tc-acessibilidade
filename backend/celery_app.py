import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "motor_acessibilidade",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['tasks']  # <--- SÓ ADICIONAR ESTA LINHA AQUI!
)

celery_app.conf.update(task_track_started=True)