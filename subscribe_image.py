#!/usr/bin/env python2
# coding: UTF-8

import rospy
import sensor_msgs
import message_filters
from sensor_msgs.msg import Image, CompressedImage, CameraInfo
from cv_bridge import CvBridge
import cv2
import dynamic_reconfigure.client

global i
global j

def callback(color_image,depth_image):
    print('sync test')
    global i
    global j
    bridge = CvBridge()
    cv_image_color = bridge.imgmsg_to_cv2(color_image, "bgr8")
    color2gray = cv2.cvtColor(cv_image_color, cv2.COLOR_BGR2GRAY)
    laplacian = cv2.Laplacian(color2gray, cv2.CV_64F)
    print(str(laplacian.var())+'    ['+str(i)+']')
    cv_image_depth = bridge.imgmsg_to_cv2(depth_image, "16UC1")
    if(laplacian.var() > 300):
        cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/color_s/%06d.jpg'% i, cv_image_color)
        cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/depth_s/%06d.png'% i, cv_image_depth)
        i += 1
        j += 1
    else:
        cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/color_f/%06d.jpg'% j, cv_image_color)
        cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/depth_f/%06d.png'% j, cv_image_depth)
        j += 1
        i += 1
    print('sync test sync test')



def adder():
    rospy.init_node('adder', anonymous=True)

    #sub1 = message_filters.Subscriber('camera/color/image_raw/compressed',CompressedImage)
    #sub2 = message_filters.Subscriber('camera/aligned_depth_to_color/image_raw/compressed',CompressedImage)
    sub1 = message_filters.Subscriber('image_decompressed',Image)
    sub2 = message_filters.Subscriber('depth_decompressed',Image)
    #sub2 = message_filters.Subscriber('camera/aligned_depth_to_color/image_raw',Image)

    fps = 100. 
    delay = 1/fps*0.5

    ts = message_filters.ApproximateTimeSynchronizer([sub1,sub2], 10, delay)
    ts.registerCallback(callback)


    rospy.spin()

def callback2():
    print('dynamic reconfigure!')


if __name__ == '__main__':
    global i
    global j
    i=0
    j=0
    #client = dynamic_reconfigure.client.Client("/camera/aligned_depth_to_color/image_raw/compressedDepth/", timeout=30, config_callback=callback)
    #client.update_configuration({"png_level": 5})
    print('OK')
    adder()