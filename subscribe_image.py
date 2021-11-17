#!/usr/bin/env python2
# coding: UTF-8

import rospy
import sensor_msgs
import message_filters
from sensor_msgs.msg import Image, CompressedImage, CameraInfo
from cam_lecture.msg import start_stop
from cam_lecture.msg import rensyaOK
from cv_bridge import CvBridge
import cv2
import dynamic_reconfigure.client

global i
global SS
global j
pub = rospy.Publisher('rensyaCtoR',rensyaOK,queue_size=100)
msgs = rensyaOK()
rensyaCount = 1

def callback(color_image,depth_image):
    #print('sync test')
    global i
    global j
    global SS
    global rensyaCount
    bridge = CvBridge()
    cv_image_color = bridge.imgmsg_to_cv2(color_image, "bgr8")
    color2gray = cv2.cvtColor(cv_image_color, cv2.COLOR_BGR2GRAY)
    laplacian = cv2.Laplacian(color2gray, cv2.CV_64F)
    #print(str(laplacian.var())+'    ['+str(i)+']')
    cv_image_depth = bridge.imgmsg_to_cv2(depth_image, "16UC1")
    if((rensyaCount==0) & (j < 10)):
        cv2.imwrite('/home/kugoriichi/Open3D/examples/Cuda/ReconstructionSystem/dataset/realsense/color/%06d.jpg'% i, cv_image_color)
        cv2.imwrite('/home/kugoriichi/Open3D/examples/Cuda/ReconstructionSystem/dataset/realsense/depth/%06d.png'% i, cv_image_depth)
        i += 1
        print('sync test sync test')
        j += 1
    if(j==10):
        msgs.rensya=1
        pub.publish(msgs)
        rensyaCount=1

def callback_rensya(message):
    if(message.rensya==0):
        rensyaCount=0
        j=0


#recieve 1 and save no bure image
def callback_SS(message):
    print("aiueo")
    global SS
    global j
    SS = 1
    j=0

    




def adder():
    rospy.init_node('adder', anonymous=True)

    #sub1 = message_filters.Subscriber('camera/color/image_raw/compressed',CompressedImage)
    #sub2 = message_filters.Subscriber('camera/aligned_depth_to_color/image_raw/compressed',CompressedImage)
    sub1 = message_filters.Subscriber('image_decompressed',Image)
    sub2 = message_filters.Subscriber('depth_decompressed',Image)
    #sub2 = message_filters.Subscriber('camera/aligned_depth_to_color/image_raw',Image)
    #pub = rospy.Publisher('rensyaOK',rensyaOK,queue_size=100)

    fps = 100. 
    delay = 1/fps*0.5

    ts = message_filters.ApproximateTimeSynchronizer([sub1,sub2], 10, delay)
    ts.registerCallback(callback)

    sub_SS = rospy.Subscriber('start_stop', start_stop , callback_SS)
    sub_rensya = rospy.Subscriber('rensyaRtoC', rensyaOK , callback_rensya)
    rospy.spin()

def callback2():
    print('dynamic reconfigure!')


if __name__ == '__main__':
    global i
    i=0
    global SS
    SS = 0
    global j
    j = 11
    #client = dynamic_reconfigure.client.Client("/camera/aligned_depth_to_color/image_raw/compressedDepth/", timeout=30, config_callback=callback)
    #client.update_configuration({"png_level": 5})
    print('OK')
    adder()