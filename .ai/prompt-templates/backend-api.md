# Backend API Template

When creating a new API endpoint in the Django backend:

1. **Create API module**: `backend/api/[feature-name]/`
2. **Structure**:
   - `views.py` - API view classes
   - `serializers.py` - DRF serializers
   - `urls.py` - URL routing
   - `__init__.py` - Package initialization

3. **Domain module**: Create corresponding module in `backend/modules/[feature-name]/`
   - `models.py` - Django models
   - `services.py` - Business logic
   - `utils.py` - Helper functions

4. **Example**:
```python
# backend/api/myfeature/views.py
from rest_framework.viewsets import ModelViewSet
from .serializers import MyFeatureSerializer

class MyFeatureViewSet(ModelViewSet):
    queryset = MyFeature.objects.all()
    serializer_class = MyFeatureSerializer
```
