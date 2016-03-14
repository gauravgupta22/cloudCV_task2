
from django.http import HttpResponse,HttpResponseServerError
from django.shortcuts import render
from task2.models import Image
import json
from task2.openCVmodules import *
from task2.openCVjsplumb import *
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

def flowchartUpload(request):
    if request.method == 'POST':
        
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


        data=json.loads(request.POST.get('flowchart'))
        print data
        length_flowchart=len(data["flowchart"])
        flowchart=data["flowchart"]
        s=datetime.now().strftime('%Y%m%d%H%M%S')+randomword(5)
        BASE_DIR=BASE_DIR+"/media/images/"+s
        ext="jpg"
        IMG_URL="/media/images/"+s

        def imageLocation(i):
            return BASE_DIR+str(i)+"."+ext

        def urlLocation(i):
            return IMG_URL+str(i)+"."+ext
        
        input_keys=[];
        for element in flowchart:
            if element["type"]=="input":
                input_keys.append(element["id"])

        print input_keys

        for i in input_keys:
            try:
                image=request.FILES['file'+str(i)]
            except:
                return HttpResponseServerError("No image found in Input Module")
            print image.name
            ext=image.name.split(".")[-1].lower()
            image_name=s+str(i)+"."+ext
            newimage = Image(name=image_name,imagefile = request.FILES['file'+str(i)])
            newimage.save()

        processlist=[0]*length_flowchart
        stack=[]
        stack.extend(input_keys);

        print length_flowchart,processlist,stack



        def processPossible(i):
            for x in flowchart[i]["inputs"]:
                if processlist[x]==0:
                    return 0
            return 1

        def process(i):
            print "process"+str(i) +"is called"
            if flowchart[i]["type"]=="process" or flowchart[i]["type"]=="output":
                print "in 1.......",processlist[i]
                if not processlist[i]:
                    print [imageLocation(j) for j in flowchart[i]["inputs"]]
                    img=myd[flowchart[i]["detail"]]([imageLocation(j) for j in flowchart[i]["inputs"]],imageLocation(i),flowchart[i]["params"])
                    if type(img) is list:
                        if img[0]=="error":
                            print "ERRORRRRRRRRRRRRRRSS"
                            return HttpResponseServerError(img[1])
                    print "processed"
                    processlist[i]=1;
            elif flowchart[i]["type"]=="input":
                processlist[i]=1;
            




        while(len(stack)):
            print "stack",stack
            i=len(stack)-1;
            print i,processPossible(stack[i]),stack[i]
            while not processPossible(stack[i]):
                i=i-1;
            process(stack[i])
            a=stack[i]
            stack.remove(stack[i])
            print "after rem stack",stack
            for x in flowchart[a]["outputs"]:
                if not x in stack:
                    stack.append(x) 

        response_data=[urlLocation(i) for i in range(length_flowchart)]

        
        
        
        
        
        

        

        

        #print request.FILES['file'].content_type
        '''
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
            '''

        response_dict={}
        response_dict["urls"]=response_data

        # Redirect to the document list after POST
        #return HttpResponseRedirect(reverse('myapp.views.list'))
        return HttpResponse(json.dumps(response_dict), content_type="application/json")
    else:
        return HttpResponse("get request")


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
        print BASE_DIR,image_url,location
        response_data.append(image_url)
        
        img = cv2.imread(location)
        print data["pipeline"]

        i=1
        for module in data["pipeline"]:
            l=image_url.split(".")
            image_url=l[0][:-1]+str(i)+"."+l[1]
            response_data.append(image_url)
            location=BASE_DIR+image_url
            img=mydct[module["name"]]([img],location,module["params"])
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
		