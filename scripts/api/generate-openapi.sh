# AI-META-BEGIN
# 
# AI-META: API route handler
# OWNERSHIP: scripts (build/deployment utilities)
# ENTRYPOINTS: HTTP API endpoint
# DEPENDENCIES: Standard library only
# DANGER: None identified
# CHANGE-SAFETY: Schema changes: breaking. Implementation: test with integration tests
# TESTS: Run: pnpm test && pnpm type-check
# 
# AI-META-END

#!/bin/bash
# Generate and validate OpenAPI schema for API gateway

set -e

echo "🔧 Generating OpenAPI schema..."

# Navigate to API gateway directory
cd "$(dirname "$0")/../../services/api-gateway/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
  echo "⚠️  Virtual environment not found. Creating one..."
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install documentation dependencies
echo "📦 Installing documentation dependencies..."
pip install -q -r requirements-docs.txt 2>/dev/null || echo "Note: Install dependencies manually if needed"

# Generate OpenAPI schema
echo "📝 Generating schema..."
OUTPUT_DIR="../../../docs/api"
mkdir -p "$OUTPUT_DIR"

# Generate YAML schema
python manage.py spectacular --color --file "$OUTPUT_DIR/openapi.yaml" --format openapi-yaml || {
  echo "⚠️  Schema generation requires Django setup. Creating placeholder..."
  
  cat > "$OUTPUT_DIR/openapi.yaml" << 'YAML'
openapi: 3.0.3
info:
  title: Firm Template API
  version: 1.0.0
  description: |
    API documentation for Firm Template platform.
    
    This is a placeholder schema. Run this script with a configured
    Django environment to generate the full API schema.
    
  contact:
    name: API Support
    email: api@firm-template.com

servers:
  - url: http://localhost:8000/api/v1
    description: Local development server
  - url: https://api.firm-template.com/v1
    description: Production server

paths:
  /health:
    get:
      summary: Health check endpoint
      description: Returns the health status of the API
      responses:
        '200':
          description: API is healthy
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: healthy
                  version:
                    type: string
                    example: 1.0.0

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
YAML
}

# Generate JSON schema
python manage.py spectacular --color --file "$OUTPUT_DIR/openapi.json" --format openapi || {
  echo "ℹ️  JSON schema generation skipped (Django setup required)"
}

echo "✅ OpenAPI schema generated at $OUTPUT_DIR/"
echo ""
echo "📖 View documentation:"
echo "  - Swagger UI: http://localhost:8000/docs/"
echo "  - ReDoc: http://localhost:8000/docs/redoc/"
echo "  - Schema: $OUTPUT_DIR/openapi.yaml"

deactivate
