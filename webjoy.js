var ros = new ROSLIB.Ros();

var serverURL = "ws://" + location.hostname + ":9090";


var mjpegViewer = new MJPEGCANVAS.Viewer({
                    divID : 'video',
                    host : document.location.hostname,
                    port : 8080,
                    width : Math.round(window.innerWidth),
                    height : Math.round(window.innerHeight/2),
                    quality : 30,
                    topic : "/camera/color/image_raw"
                });

                

                


var mouseDX=0;//押下時座標DX,DY
var mouseDY=0;
var mouseUX=0;//離した時座標UX,UY
var mouseUY=0;
var centerX,centerY;//バウンディングボックス中心座標変数
var centerX_Ratio,centerY_Ratio;
var HeightRatio,WidthRatio;//バウンディングボックスの高さ，幅の全体に対する割合
var UserHeight,UserWidth;
var t,f;
var intDX,intDY,intUX,intUY;
var TOUCH_FLAG=true;

var Robot_move_ptn = new ROSLIB.Topic({
        ros : ros,
        name : 'robot_move',
        messageType : 'cam_lecture/robot_move'
    });
var pub_pub = new ROSLIB.Topic({
        ros : ros,
        name : 'rensyaCtoR',
        messageType : 'cam_lecture/rensyaOK'
    });




var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/cmd_vel',
    messageType : 'geometry_msgs/Twist'
});

var twist = new ROSLIB.Message();
var Robot_move = new ROSLIB.Message();

var joyDirection;

var LINEAR_VEL = 0.05;
var ANGULAR_VEL = 0.2; 

function init_ros() {
        try {
                ros.connect(serverURL);
                console.log("Connected to ROS.");
        } catch (error) {
                console.error(error);
        }
}

ros.on('connection', function() {
        console.log('Rosbridge connected.');
});

ros.on('error', function(error) {
        console.log("Rosbridge Error: " + error);
        disconnectServer();
});

ros.on('close', function(error) {
        console.log("Rosbridge Close: " + error);
});

function disconnectServer() {
        console.log("Disconnecting from ROS.");
        ros.close();
}

//joy1
var joystick = nipplejs.create({
        zone: document.getElementById('joystick'),
        mode: 'static',
        position: { left: '25%', top: '90%' },
        color: 'blue',
        size: 50
    });

//joy2
var joystick2 = nipplejs.create({
        zone: document.getElementById('joystick2'),
        mode: 'static',
        position: { left: '75%', top: '90%' },
        color: 'blue',
        size: 50
    });

joystick.on('start end', function (evt, data) {
      twist = new ROSLIB.Message();
      cmdVel.publish(twist);
});

joystick.on('dir', function (evt, data) {
      joyDirection = data.direction.angle;
});

joystick.on('move', function (evt, data) {
      var distance = data.distance;
      var vel_x = vel_theta = 0.0;
     
      var x = LINEAR_VEL * distance / 75.0;
      var theta = ANGULAR_VEL * distance / 75.0;

      if(joyDirection === "up"){
        vel_x = x;
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 3
        });
        Robot_move_ptn.publish(Robot_move);

      }
      else if(joyDirection === "down"){
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);
      }
      else if(joyDirection === "right"){
        vel_theta = -theta;
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 2
        });
        Robot_move_ptn.publish(Robot_move);
      }
      else if(joyDirection === "left"){
        vel_theta = theta;
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 1
        });
        Robot_move_ptn.publish(Robot_move);
      }
      

      twist = new ROSLIB.Message({
          linear : {
          x : vel_x,
          y : 0.0,
          z : 0.0
        },
          angular : {
          x : 0.0,
          y : 0.0,
          z : vel_theta
        }
     });
     cmdVel.publish(twist);
          
});




//////////////////////////////////////mouse down////////////////////////////////////////
var Robot_move = new ROSLIB.Message();
/*
document.getElementById("camera_up").addEventListener("touchstart",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 3,
                move_ptn : 1
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("camera_down").addEventListener("touchstart",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 3,
                move_ptn : 2
        });
        Robot_move_ptn.publish(Robot_move);
});
*/
var mode_select=21;

var flag=false;

function toggle(){
        flag = !flag; // trueとfalseの切り替え ! 否定演算子
        document.getElementById("mode_switch").value = "Object Mode"; // ボタンのラベルの変更
        if(flag == true){ 
                document.getElementById("mode_switch").value = "１.物体撮影モード";
                mode_select=20;
        } //条件を満たした場合の処理
        else{
                document.getElementById("mode_switch").value = "２.環境撮影モード";
                mode_select=22;
        } //条件を満たしていない場合の処理}
}

document.getElementById("s_modeling").addEventListener("click",function(e){
        e.preventDefault();
        let check = confirm('モデリングを開始しますか？');
        if(check){

                if(mode_select==20){
                        Robot_move = new ROSLIB.Message({
                                id : 100,
                                move_ptn : 20
                        });
                }
                if(mode_select==21){
                        Robot_move = new ROSLIB.Message({
                                id : 100,
                                move_ptn : 21
                        });
                }
                if(mode_select==22){
                        Robot_move = new ROSLIB.Message({
                                id : 100,
                                move_ptn : 22
                        });
                }
                Robot_move_ptn.publish(Robot_move);
                console.log('mode_select'+mode_select);
        }

});


/***********************************pub sample*******************************:: */

