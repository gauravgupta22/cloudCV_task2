import numpy as np
import cv2
from matplotlib import pyplot as plt

# Load an color image in grayscale
#img = cv2.imread('car.png')


def RGB2Grayscale(img,location,params):
	

	img = cv2.imread(img[0])
	try:
		gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		cv2.imwrite(location,gray_img)
		return gray_img
	except:
		return ["error","Invalid pipeline"]

def Output(img,location,params):
	img = cv2.imread(img[0])
	try:
		cv2.imwrite(location,img)
		return img
	except:
		return ["error","Invalid pipeline"]


def EdgeDetection(img,location,params):
	print "In edge detection"
	print img,location,params

	img = cv2.imread(img[0])
	
	try:
		edges = cv2.Canny(img,int(params["minVal"]),int(params["maxVal"]))
		
		cv2.imwrite(location,edges)
		return edges
	except TypeError:
		return ["error","Invalid Parameters in Edge Detection module"]
	except:
		return ["error", "Invalid pipeline"]

	

def Smoothen(img,location,params):
	img = cv2.imread(img[0])
	try:
		blur = cv2.blur(img,(int(params["width"]),int(params["height"])))
		cv2.imwrite(location,blur)
		return blur
	except TypeError:
		return ["error","Invalid Parameters in Smoothen module"]
	except:
		return ["error", "Invalid pipeline"]

def SobelFilter(img,location,params):
	img = cv2.imread(img[0])
	try:
		sobel = cv2.Sobel(img,cv2.CV_64F,int(params["xorder"]),int(params["yorder"]),ksize=int(params["ksize"]))
		cv2.imwrite(location,sobel)
		return sobel
	except TypeError:
		return ["error","Invalid Parameters in Sobel Filter module"]
	except:
		return ["error", "Invalid pipeline"]

def BinaryThreshold(img,location,params):
	img = cv2.imread(img[0])
	try:
		ret,thresh = cv2.threshold(img,int(params["thresholdValue"]),int(params["maxVal"]),cv2.THRESH_BINARY)
		cv2.imwrite(location,thresh)
		return thresh
	except TypeError:
		return ["error","Invalid Parameters in Binary Threshold module"]
	except:
		return ["error", "Invalid pipeline"]

def Resize(img,location,params):
	img = cv2.imread(img[0])
	try:
		res = cv2.resize(img,(int(params["width"]),int(params["height"])), interpolation = cv2.INTER_CUBIC)
		cv2.imwrite(location,res)
		return res
	except TypeError:
		return ["error","Invalid Parameters in Resize module"]
	except:
		return ["error", "Invalid pipeline"]

def ImageBlending(img,location,params):
	print "image blend.........."
	img1 = cv2.imread(img[0])
	img2 = cv2.imread(img[1])
	img1=cv2.resize(img1,(300,300), interpolation = cv2.INTER_CUBIC)
	img2=cv2.resize(img2,(300,300), interpolation = cv2.INTER_CUBIC)
	try:
		dst = cv2.addWeighted(img1,0.7,img2,0.3,0)
		cv2.imwrite(location,dst)
		return dst
	except TypeError:
		return ["error","Invalid Parameters in Resize module"]
	except:
		return ["error", "Invalid pipeline"]
#hist = cv2.calcHist([img],[0],None,[256],[0,256])

#plt.hist(img.ravel(),256,[0,256]); plt.show()

#res = cv2.resize(img,None,fx=2, fy=2, interpolation = cv2.INTER_CUBIC)

'''
#Rotation convert to grayscale before
rows,cols = img.shape
M = cv2.getRotationMatrix2D((cols/2,rows/2),90,1)
dst = cv2.warpAffine(img,M,(cols,rows))
'''

#binary threshhold
# ret,thresh1 = cv2.threshold(img,127,255,cv2.THRESH_BINARY)
'''
cv2.imshow('image',thresh1)
cv2.waitKey(0)
cv2.destroyAllWindows()
'''
myd = {'rgb2grayscale': RGB2Grayscale,'image_blending':ImageBlending,'output':Output,'smoothen':Smoothen,'edge_detection':EdgeDetection,'sobel_filter':SobelFilter,'binary_threshold':BinaryThreshold,'resize':Resize}
