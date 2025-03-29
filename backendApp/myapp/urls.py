from django.urls import path
from .views import upload_single_image, upload_multiple_images

urlpatterns = [
    path('upload/single/', upload_single_image, name='upload_single_image'),
    path('upload/multiple/', upload_multiple_images, name='upload_multiple_images'),
]