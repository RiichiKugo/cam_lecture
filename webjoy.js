var ros = new ROSLIB.Ros();

var serverURL = "ws://" + location.hostname + ":9090";

var mjpegViewer = new MJPEGCANVAS.Viewer({
                    divID : 'video',
                    host : document.location.hostname,
                    port : 8080,
                    width : Math.round(window.innerWidth/2),
                    height : Math.round(window.innerWidth * 480/640/2),
                    quality : 10,
                    topic : "/camera/color/image_raw"
                });

                
                
                    //emptySrv object
let emptySrv = new ROSLIB.ServiceRequest({
         })
                


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

/*
var centerRatio = new ROSLIB.Topic({
        ros : ros,
        name : '/rtabmap/centerXY',
        messageType : 'rtabmap_ros/centerXY'
    });

var centerXY_Ratio;
*/
var Robot_move_ptn = new ROSLIB.Topic({
        ros : ros,
        name : 'robot_move',
        messageType : 'cam_lecture/robot_move'
    });



/*
document.getElementById("video").addEventListener("touchstart",function(e){
        //document.getElementById("exam").innerHTML = "<h3>X:Y"+mouseX+":"+mouseY+"</h3>";
        //e.preventDefault();
        
                
        console.log("mouseDown");
        document.getElementById("joy_vel").innerHTML = "<h3>offsetwidth="+document.getElementById("video").offsetWidth+"offsetHeight="+document.getElementById("video").offsetHeight+"</h3>";
});
document.getElementById("video").addEventListener("touchmove",function(e){
        e.preventDefault();
        t= e.touches[0];
        if(TOUCH_FLAG){
                mouseDX = t.pageX - this.offsetLeft;
                mouseDY = t.pageY - this.offsetTop;
                intDX = parseInt(mouseDX);
                intDY = parseInt(mouseDY);
                TOUCH_FLAG=false;
        }
        

});
document.getElementById("video").addEventListener("touchend",function(e){  //ドラッグドロップok
        e.preventDefault();
        mouseUX = t.pageX - this.offsetLeft;
        mouseUY = t.pageY - this.offsetTop;
        intUX = parseInt(mouseUX);
        intUY = parseInt(mouseUY);
        document.getElementById("examD").innerHTML = "<h3>DX:DY"+intDX+":"+intDY+"</h3>";
        document.getElementById("examU").innerHTML = "<h3>UX:UY"+intUX+":"+intUY+"</h3>";
        centerX = parseInt(((intUX-intDX)/2) + intDX);
        centerY = parseInt(((intUY-intDY)/2) + intDY);
        centerX_Ratio = parseInt(centerX/document.getElementById("video").offsetWidth*100);//中心座標の全体に対する割合
        centerY_Ratio = parseInt(centerY/document.getElementById("video").offsetHeight*100);//中心座標の全体に対する割合

        UserWidth = parseInt(intUX - intDX);
        UserHeight = parseInt(intUY - intDY);
        WidthRatio = parseInt(UserWidth/document.getElementById("video").offsetWidth*100);
        HeightRatio = parseInt(UserHeight/document.getElementById("video").offsetHeight*100);

        console.log("mouseUp");
        document.getElementById("joy_vel").innerHTML = "<h3>"+centerX_Ratio+"  :  "+centerY_Ratio+"</h3>";
       //document.getElementById("joy_vel").innerHTML = "<h3>映像サイズ：X="+this.offsetWidth+"   Y="+this.offsetHeight+"</h3>";
        TOUCH_FLAG = true;
        if(window.confirm("指定領域でモデリングを開始しますか？")){
                
                centerXY_Ratio = new ROSLIB.Message({// ok
                        centerX : centerX_Ratio,
                        centerY : centerY_Ratio,
                        HeightRatio : HeightRatio,
                        WidthRatio  :  WidthRatio
                });
                centerRatio.publish(centerXY_Ratio);

                //resetRtabmapSrv.callService(emptySrv, result => {
               // });
                

        }else{

        }
});

*/



var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/cmd_vel',
    messageType : 'geometry_msgs/Twist'
});

var twist = new ROSLIB.Message();

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
//////////////////////////////////////mouse down////////////////////////////////////////
var Robot_move = new ROSLIB.Message();;

document.getElementById("robot_move_left").addEventListener("touchstart",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 1
        });
        Robot_move_ptn.publish(Robot_move);

});
document.getElementById("robot_move_front").addEventListener("touchstart",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 3
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("robot_move_right").addEventListener("touchstart",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 2
        });
        Robot_move_ptn.publish(Robot_move);
});
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


document.getElementById("robot_move_left").addEventListener("touchmove",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 1
        });
        Robot_move_ptn.publish(Robot_move);

});
document.getElementById("robot_move_front").addEventListener("touchmove",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 3
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("robot_move_right").addEventListener("touchmove",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 12,
                move_ptn : 2
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("camera_up").addEventListener("touchmove",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 3,
                move_ptn : 1
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("camera_down").addEventListener("touchmove",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 3,
                move_ptn : 2
        });
        Robot_move_ptn.publish(Robot_move);
});

//////////////////////////////////////////////////////////////////////////
/////////////////////////////mouse up////////////////////////////////////////////
document.getElementById("robot_move_left").addEventListener("touchend",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);

});
document.getElementById("robot_move_front").addEventListener("touchend",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("robot_move_right").addEventListener("touchend",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("camera_up").addEventListener("touchend",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);
});
document.getElementById("camera_down").addEventListener("touchend",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);
});
/////////////////////////////////////////////////////////////////////////
document.getElementById("stop").addEventListener("click",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 0,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);
});

document.getElementById("s_modeling").addEventListener("click",function(e){
        e.preventDefault();
        Robot_move = new ROSLIB.Message({
                id : 100,
                move_ptn : 0
        });
        Robot_move_ptn.publish(Robot_move);

});
