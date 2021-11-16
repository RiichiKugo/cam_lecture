#include "ros/ros.h"
#include "sensor_msgs/LaserScan.h"
#include "urg_test/objection_detect_id.h"
#include "urg_test/systemstart.h"
#include "urg_test/turnOK.h"
#include "cam_lecture/robot_move.h"

ros::Publisher obj_detectID_pub;
urg_test::objection_detect_id msgs;

namespace
{
  int movePtn=0;
  int system_start=0;
  bool turnOK = false;
   auto avg_distance=0.0;

  void system_start_callback(const urg_test::systemstart &msg) //  OK
  {
    //スマホからの合図でシステムスタート！！　ここで読み込んだ値から行動パターンを変える
    if(msg.SystemStart==1){
      system_start = msg.SystemStart;
      //ROS_INFO_STREAM("System_start");
    }
      

  }

  void turnOK_callback(const urg_test::turnOK &msg) 
  {

    turnOK = msg.turnOK;
    ROS_INFO_STREAM("tunOK"<< turnOK);
    }

  void robot_movecallback(const cam_lecture::robot_move &msg) 
  {
    if(msg.id==100){
      //modeling startの合図
      //障害物までの距離送信
      msgs.move_ptn=avg_distance;
      obj_detectID_pub.publish(msgs);
      
    }
    ROS_INFO_STREAM("tunOK"<< turnOK);
    }
      


  void laser_callback(const sensor_msgs::LaserScan &msg)
  {
    if (msg.ranges.empty())
    {
      ROS_WARN_STREAM("URG data is empty.");
      return;
    }
    

    int left=0,right=0,center=0;
    int diff_threshold;
//障害物回避処理記述，ダイナミクセルに指令を出す．

    auto len_near=msg.ranges.at(0);
    auto len_now=0.0;
    auto distance_sum=0.0;
    int move_ptn;

    for(int i=306;i<442; i++){//center part(正面に物体があるかどうか) 
        len_now = msg.ranges.at(i);
        if(len_now <= 1.000 && len_now >=0.300){
          //near less than 1m
          center++;
          distance_sum += len_now;
        }
      }
      if(center>10){
        avg_distance = distance_sum/center;
        avg_distance= (int)(avg_distance*100); //cmに変換

      }
      ROS_INFO_STREAM("avg_distance"<< avg_distance);




/*
    if(system_start == 1){
      for(int i=306;i<442; i++){//center part(正面に物体があるかどうか) 
        len_now = msg.ranges.at(i);
        if(len_now <= 1.000 && len_now >=0.300){
          //near less than 1m
          center++;
          distance_sum += len_now;
        }
      }
      //msgs.radius = avg_distance;
      if(center > 10){
        //前方に物体アリ

        //物体との距離算出（回転半径に使用）
        avg_distance = distance_sum/center;
        //ROS_INFO_STREAM("avg_distance"<< avg_distance);

        for(int i=150;i<306; i++){//right side 
          len_now = msg.ranges.at(i);
          if(len_now < 1.300)//near less than 130cm
          right++;
        }
        for(int i=441;i<620; i++){//left side 
          len_now = msg.ranges.at(i);
          if(len_now <= 1.300)//near less than 130cm
          left++;
        }
        if(right < 10 && left < 10) {
          //左右斜め方向に1.3m以内に何もない　＝＝　１のパターン
          msgs.move_ptn = 1;
          move_ptn = 1;
          //ROS_INFO_STREAM("MovePattern:1");
        }else{
          if(msg.ranges.at(250) > 1.300 && msg.ranges.at(520) > 1.300){ 
            msgs.move_ptn = 2;
            move_ptn = 2;
            //ROS_INFO_STREAM("MovePattern:2");
          }else{
            //斜め方向ロボットの通り道に壁等あり通れない==３
            msgs.move_ptn = 3;
            move_ptn = 3;
            //ROS_INFO_STREAM("MovePattern:3 ");
          }
        }
      }else{
        //そもそも前に物体がないので周辺環境のモデリング
        msgs.move_ptn = 3;
        move_ptn = 3;
        //ROS_INFO_STREAM("MovePattern:3 nothing");
      }
      msgs.move_ptn=10;
      //msgs.moving = 5; //とりあえず横向いてカメラは正面
      //obj_detectID_pub.publish(msgs);

    }
    auto min_value = 6.0;

    avg_distance = 0.500;
    //ROS_INFO_STREAM("right value ::: "<<msg.ranges.at(150));
    if(turnOK == false){
        for(int i=100;i<201; i++){ 
          len_now = msg.ranges.at(i);
          if(len_now > 0.150 && len_now <= min_value){
          min_value = len_now; //最小値を更新
          }
        }
        if((min_value <= (avg_distance + 0.050)) && (min_value >= (avg_distance - 0.050))){
          msgs.moving = 0;//stop
          obj_detectID_pub.publish(msgs);
          turnOK =true;  
        }else{
          if(system_start==1){
            msgs.moving = 5;//turn
            obj_detectID_pub.publish(msgs);
          }
        }  
    }
    system_start = 0; //１回きりで次回から入らない
    //ROS_INFO_STREAM("turnOK"<< turnOK);

    if(turnOK == true){
      move_ptn = 1;
      msgs.move_ptn = 1;
      
      auto min_obj = 2.000;
      if(move_ptn == 1){

        for(int i=100;i<201; i++){ 
          len_now = msg.ranges.at(i);
          if(len_now > 0.150 && len_now <= min_obj){
            min_obj = len_now; //最小値を更新
          }
        }
        if(msg.ranges.at(362)< 0.200){
          //正面30cm以内に物体→停止 無ければ判定
          msgs.moving = 0;
          obj_detectID_pub.publish(msgs);
          ROS_INFO_STREAM("0000000000");
        }else{

          msgs.moving = 3 ;//近づけさせる
          ROS_INFO_STREAM("tikazuku");
          obj_detectID_pub.publish(msgs);

        }


      }else if(move_ptn ==2){

      }else if(move_ptn == 3){

      }else{
        //stop!!
      }
    }




  }
  */
}
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "urg_test");
  ros::NodeHandle n;
  ros::Subscriber laser = n.subscribe("scan", 1, laser_callback);
  ros::Subscriber system_start = n.subscribe("system_start", 1, system_start_callback);
  ros::Subscriber turnOK = n.subscribe("turnOK", 1, turnOK_callback);
  obj_detectID_pub = n.advertise<urg_test::objection_detect_id>("objection_detect_id", 1000);
  ros::Rate loop_rate(50);
  ros::Subscriber robot_move = n.subscribe("robot_move", 1, robot_movecallback);

  while (ros::ok())
  {
    ros::spinOnce();
    loop_rate.sleep();
  }

  return 0;
  
}
