from celery import Celery

from core.config import settings


celery_app = Celery(
    "motor_acessibilidade",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["tasks"]
)

celery_app.conf.update(task_track_started=True)