from __future__ import unicode_literals

from django.db import models

def content_file_name(instance, filename):
    return '/'.join(['images', instance.name])

# Create your models here.
class Image(models.Model):
    imagefile = models.FileField(upload_to=content_file_name)
    name = models.CharField(max_length=200)



