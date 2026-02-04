"""
API Documentation URLs

Configures URL routing for API documentation endpoints including
Swagger UI, ReDoc, and OpenAPI schema.
"""

from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # OpenAPI schema
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI (primary documentation interface)
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # ReDoc (alternative documentation interface)
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
