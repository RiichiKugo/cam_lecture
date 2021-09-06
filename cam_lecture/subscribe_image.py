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

def callback(color_image,depth_image):
    print('sync test')
    global i
    bridge = CvBridge()
    cv_image_color = bridge.imgmsg_to_cv2(color_image, "bgr8")
    cv_image_depth = bridge.imgmsg_to_cv2(depth_image, "16UC1")
    cv2.imwrite('/home/riichikugo/Open3D/examples/Python/ReconstructionSystem/dataset/sample_ros_image_save/color/%06d.jpg'% i, cv_image_color)
    cv2.imwrite('/home/riichikugo/Open3D/examples/Python/ReconstructionSystem/dataset/sample_ros_image_save/depth/%06d.png'% i, cv_image_depth)
    print('sync test sync test')
    i += 1



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
    i=0
    #client = dynamic_reconfigure.client.Client("/camera/aligned_depth_to_color/image_raw/compressedDepth/", timeout=30, config_callback=callback)
    #client.update_configuration({"png_level": 5})
    print('OK')
    adder()