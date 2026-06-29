from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import custom_404

handler404 = 'core.views.custom_404'


def fake_admin(request, path=''):
    """Ancienne URL /admin/ → fausse 404 pour décourager le scan automatique."""
    return custom_404(request)


urlpatterns = [
    path('admin/',            fake_admin),
    path('admin/<path:path>', fake_admin),

    # Admin réel à une URL non triviale
    path('gestion/', admin.site.urls),

    path('', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        path('__reload__/', include('django_browser_reload.urls')),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
