from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^upload$', views.imageUpload, name='imageUpload'),
	url(r'^uploadflowchart$', views.flowchartUpload, name='flowchartUpload'),
    url(r'^$', views.index, name='index'),
]