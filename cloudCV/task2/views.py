
from django.http import HttpResponse,HttpResponseServerError
from django.shortcuts import render
from task2.models import Image
import json
from task2.openCVmodules import *
import cv2
from datetime import datetime
import random, string
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def randomword(length):
   return ''.join(random.choice(string.lowercase) for i in range(length))


def index(request):
    #context = {'latest_question_list': latest_question_list}
    return render(request, 'task2/base.html',{'title':'task2 demo'})


def imageUpload(request):
    # Handle file upload
    if request.method == 'POST':
        try:
            image=request.FILES['file']
        except:
            return HttpResponseServerError("No image found in Input Module")
        
        s=datetime.now().strftime('%Y%m%d%H%M%S')
        print image.name
        ext=image.name.split(".")[-1].lower()
        image_name=s+randomword(5)+"0."+ext

        newimage = Image(name=image_name,imagefile = request.FILES['file'])
        newimage.save()

        response_data=[]

        #print request.FILES['file'].content_type
        
        data=json.loads(request.POST.get('pipe'))
        length_pipeline=len(data["pipeline"])
        image_url=newimage.imagefile.url
        location=BASE_DIR+image_url
        response_data.append(image_url)
        
        img = cv2.imread(location)
        print data["pipeline"]

        i=1
        for module in data["pipeline"]:
            l=image_url.split(".")
            image_url=l[0][:-1]+str(i)+"."+l[1]
            response_data.append(image_url)
            location=BASE_DIR+image_url
            img=mydct[module["name"]](img,location,module["params"])
            if type(img) is list:
                if img[0]=="error":
                    return HttpResponseServerError(img[1])

            i=i+1


        response_dict={}
        response_dict["urls"]=response_data

    	# Redirect to the document list after POST
        #return HttpResponseRedirect(reverse('myapp.views.list'))
        return HttpResponse(json.dumps(response_dict), content_type="application/json")
    else:
    	return HttpResponse("get request")
		