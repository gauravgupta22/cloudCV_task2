from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^upload$', views.imageUpload, name='imageUpload'),
    url(r'^$', views.index, name='index'),
]