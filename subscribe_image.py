#!/usr/bin/env python2
# coding: UTF-8

import rospy
import sensor_msgs
import message_filters
from sensor_msgs.msg import Image, CompressedImage, CameraInfo
from cam_lecture.msg import rensyaOK,robot_move
from cv_bridge import CvBridge
import cv2
import dynamic_reconfigure.client

i=0
j=0
mode_select=21

pub = rospy.Publisher('rensyaCtoR',rensyaOK,queue_size=100)
msgs = rensyaOK()
rensyaCount =1

def callback(color_image,depth_image):
    #print('sync test')
    WIDTH = 50
    HEIGHT = 25
    global i
    global j
    global rensyaCount
    bridge = CvBridge()
    cv_image_color = bridge.imgmsg_to_cv2(color_image, "bgr8")
    cv_image_depth = bridge.imgmsg_to_cv2(depth_image, "16UC1")
    
    if(mode_select==20):
        #object mode
        if((rensyaCount==0) & (j < 10)):
            #cv2.imwrite('/home/kugoriichi/Open3D/examples/Cuda/ReconstructionSystem/dataset/realsense/color/%06d.jpg'% i, cv_image_color)
            #cv2.imwrite('/home/kugoriichi/Open3D/examples/Cuda/ReconstructionSystem/dataset/realsense/depth/%06d.png'% i, cv_image_depth)
            cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/color_f/%06d.jpg'% i, cv_image_color)
            cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/depth_f/%06d.jpg'% i, cv_image_depth)
            i += 1
            print('sync test sync test')
            j += 1
        if(j==10):
            msgs.rensya=1
            pub.publish(msgs)
            rensyaCount=1
            j=0
    elif(mode_select==22):
        #environment mode
        if(rensyaCount==0):
            cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/color_f/%06d.jpg'% i, cv_image_color)
            cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/depth_f/%06d.jpg'% i, cv_image_depth)
            i += 1
            print('sync test sync test')
            msgs.rensya=1
            pub.publish(msgs)
            rensyaCount=1
        elif(rensyaCount==1):
            msgs.rensya=0
            pub.publish(msgs)
    elif(mode_select==23):
        #manual mode
        if((rensyaCount==0) & (j < 10)):
            #cv2.imwrite('/home/kugoriichi/Open3D/examples/Cuda/ReconstructionSystem/dataset/realsense/color/%06d.jpg'% i, cv_image_color)
            #cv2.imwrite('/home/kugoriichi/Open3D/examples/Cuda/ReconstructionSystem/dataset/realsense/depth/%06d.png'% i, cv_image_depth)
            cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/color_f/%06d.jpg'% i, cv_image_color)
            cv2.imwrite('/home/riichikugo/Open3D/examples/python/reconstruction_system/dataset/sample/depth_f/%06d.jpg'% i, cv_image_depth)
            i += 1
            print('sync test sync test')
            j += 1
        if(j==10):
            msgs.rensya=1
            pub.publish(msgs)
            rensyaCount=1
            j=0


    h, w, c = cv_image_color.shape
    x1 = (w / 2) - WIDTH
    x2 = (w / 2) + WIDTH
    y1 = (h / 2) - HEIGHT
    y2 = (h / 2) + HEIGHT
    sum = 0.0

    for a in range(y1, y2):
        for b in range(x1, x2):
            cv_image_color.itemset((a, b, 0), 0)
            cv_image_color.itemset((a, b, 1), 0)

            if cv_image_depth.item(a,b) == cv_image_depth.item(a,b):
                sum += cv_image_depth.item(a,b)
    
    ave = sum / ((WIDTH * 2) * (HEIGHT * 2))
    ave = ave * 0.001
    print("%f [m]" % ave)



def callback_rensya(message):
    if(message.rensya==0):
        global rensyaCount
        rensyaCount=0

def callback_robot_move(message):
    global mode_select
    mode_select=message.move_ptn




    




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

    rospy.Subscriber('rensyaRtoC', rensyaOK , callback_rensya)
    rospy.Subscriber('robot_move', robot_move , callback_robot_move)
    rospy.spin()

def callback2():
    print('dynamic reconfigure!')


if __name__ == '__main__':
    #global i
    #i=0
    #global j
    #j = 0
    #global rensyaCount
    #rensyaCount=1
    #client = dynamic_reconfigure.client.Client("/camera/aligned_depth_to_color/image_raw/compressedDepth/", timeout=30, config_callback=callback)
    #client.update_configuration({"png_level": 5})
    print('OK')
    adder()