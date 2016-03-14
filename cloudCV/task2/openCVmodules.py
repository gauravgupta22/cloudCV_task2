import numpy as np
import cv2
from matplotlib import pyplot as plt

# Load an color image in grayscale
#img = cv2.imread('car.png')


def RGB2Grayscale(img,location,params):
	try:
		gray_img = cv2.cvtColor(img[0], cv2.COLOR_BGR2GRAY)
		cv2.imwrite(location,gray_img)
		return gray_img
	except:
		return ["error","Invalid pipeline"]


def EdgeDetection(img,location,params):
	try:
		edges = cv2.Canny(img[0],params["minVal"],params["maxVal"])
		cv2.imwrite(location,edges)
		return edges
	except TypeError:
		return ["error","Invalid Parameters in Edge Detection module"]
	except:
		return ["error", "Invalid pipeline"]

	

def Smoothen(img,location,params):
	try:
		blur = cv2.blur(img[0],(params["width"],params["height"]))
		cv2.imwrite(location,blur)
		return blur
	except TypeError:
		return ["error","Invalid Parameters in Smoothen module"]
	except:
		return ["error", "Invalid pipeline"]

def SobelFilter(img,location,params):
	try:
		sobel = cv2.Sobel(img[0],cv2.CV_64F,params["xorder"],params["yorder"],ksize=params["ksize"])
		cv2.imwrite(location,sobel)
		return sobel
	except TypeError:
		return ["error","Invalid Parameters in Sobel Filter module"]
	except:
		return ["error", "Invalid pipeline"]

def BinaryThreshold(img,location,params):
	try:
		ret,thresh = cv2.threshold(img[0],params["thresholdValue"],params["maxVal"],cv2.THRESH_BINARY)
		cv2.imwrite(location,thresh)
		return thresh
	except TypeError:
		return ["error","Invalid Parameters in Binary Threshold module"]
	except:
		return ["error", "Invalid pipeline"]

def Resize(img,location,params):
	try:
		res = cv2.resize(img[0],(params["width"],params["height"]), interpolation = cv2.INTER_CUBIC)
		cv2.imwrite(location,res)
		return res
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
mydct = {'RGB2Grayscale': RGB2Grayscale,'Smoothen':Smoothen,'Edge Detection':EdgeDetection,'Sobel Filter':SobelFilter,'Binary Threshold':BinaryThreshold,'Resize':Resize}
