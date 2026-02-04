"""
OpenAPI Schema Configuration

Configures the OpenAPI schema generation for the API gateway,
including metadata, authentication schemes, and customization.

This uses Django REST Framework's schema generation capabilities
with drf-spectacular for enhanced OpenAPI 3.0 support.
"""

from drf_spectacular.generators import SchemaGenerator
from drf_spectacular.openapi import AutoSchema


class CustomSchemaGenerator(SchemaGenerator):
    """
    Custom schema generator with additional metadata and configuration.
    """
    
    def get_schema(self, request=None, public=False):
        """
        Generate OpenAPI schema with custom configuration.
        
        Args:
            request: HTTP request object (optional)
            public: Whether to generate public API schema only
            
        Returns:
            OpenAPI schema dictionary
        """
        schema = super().get_schema(request, public)
        
        # Add custom extensions
        schema['info']['x-logo'] = {
            'url': 'https://firm-template.com/logo.png',
            'altText': 'Firm Template Logo'
        }
        
        # Add contact information
        schema['info']['contact'] = {
            'name': 'API Support',
            'email': 'api@firm-template.com',
            'url': 'https://firm-template.com/support'
        }
        
        # Add license information
        schema['info']['license'] = {
            'name': 'Proprietary',
            'url': 'https://firm-template.com/license'
        }
        
        return schema


# OpenAPI schema customization settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'Firm Template API',
    'DESCRIPTION': '''
    ## Overview
    
    The Firm Template API provides programmatic access to all platform capabilities
    including client management, project tracking, financial reporting, and analytics.
    
    ## Authentication
    
    The API uses JWT (JSON Web Token) authentication. Include your token in the
    Authorization header:
    
    ```
    Authorization: Bearer YOUR_ACCESS_TOKEN
    ```
    
    ## Rate Limiting
    
    API requests are rate limited to:
    - **100 requests per minute** for authenticated users
    - **10 requests per minute** for unauthenticated requests
    
    ## Versioning
    
    The API is versioned via URL path (e.g., `/api/v1/`). We maintain backwards
    compatibility within major versions.
    
    ## Support
    
    For API support, contact api@firm-template.com or visit our documentation portal.
    ''',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SERVE_PERMISSIONS': ['rest_framework.permissions.AllowAny'],
    
    # Schema generation
    'SCHEMA_PATH_PREFIX': '/api/',
    'COMPONENT_SPLIT_REQUEST': True,
    'COMPONENT_NO_READ_ONLY_REQUIRED': True,
    
    # Authentication configuration
    'SECURITY': [
        {
            'bearerAuth': {
                'type': 'http',
                'scheme': 'bearer',
                'bearerFormat': 'JWT',
            }
        }
    ],
    
    # Swagger UI configuration
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
        'filter': True,
        'showExtensions': True,
        'showCommonExtensions': True,
    },
    
    # ReDoc configuration
    'REDOC_UI_SETTINGS': {
        'hideDownloadButton': False,
        'expandResponses': '200,201',
        'pathInMiddlePanel': True,
        'nativeScrollbars': True,
        'theme': {
            'colors': {
                'primary': {
                    'main': '#1976d2'
                }
            }
        }
    },
    
    # Tags for organizing endpoints
    'TAGS': [
        {'name': 'Authentication', 'description': 'User authentication and token management'},
        {'name': 'Clients', 'description': 'Client management and CRM operations'},
        {'name': 'Projects', 'description': 'Project tracking and collaboration'},
        {'name': 'Finance', 'description': 'Financial reporting and invoicing'},
        {'name': 'Analytics', 'description': 'Business intelligence and metrics'},
        {'name': 'Core', 'description': 'Core system utilities and health checks'},
    ],
}
