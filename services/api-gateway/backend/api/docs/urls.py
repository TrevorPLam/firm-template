"""
API Documentation URLs

Configures URL routing for API documentation endpoints including
Swagger UI, ReDoc, and OpenAPI schema.
"""
# AI-META-BEGIN
# 
# AI-META: API route handler
# OWNERSHIP: root (configuration)
# ENTRYPOINTS: HTTP API endpoint
# DEPENDENCIES: Standard library only
# DANGER: None identified
# CHANGE-SAFETY: Schema changes: breaking. Implementation: test with integration tests
# TESTS: Run: pnpm test && pnpm type-check
# 
# AI-META-END


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
