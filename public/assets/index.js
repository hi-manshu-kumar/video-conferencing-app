window.addEventListener("DOMContentLoaded", init);
function init(){
    document.querySelector("#join-call").addEventListener("click", joinCallHandler);
    document.querySelector("#endCall").addEventListener("click", endCallHandler);
    document.querySelector("#muteCall").addEventListener("click", muteCallHandler);
    document.querySelector("#hideCamCall").addEventListener("click", hideCameraHandler);
}

var vidyoConnector2;
var cameraPrivacy = false;
var microphonePrivacy = false;

function onVidyoClientLoaded(status){
    console.log("function called", cameraPrivacy);
    switch (status.state){
        case "READY":
            console.log("Ready to connect")
            break;
        default:
            console.log("Vidyo client load failed.");
            break;
    }
}

function endCallHandler(e){
    e.preventDefault();
    console.log("hi");
    vidyoConnector2.Disconnect().then(function() {
        console.log("Disconnect Success");
    }).catch(function() {
        console.error("Disconnect Failure");
    });
}

function muteCallHandler(e){
    e.preventDefault();
    microphonePrivacy = !microphonePrivacy;
    vidyoConnector2.SetMicrophonePrivacy({
        privacy: microphonePrivacy
    }).then(function() {
        // if (microphonePrivacy) {
        //     $("#microphoneButton").addClass("microphoneOff").removeClass("microphoneOn");
        // } else {
        //     $("#microphoneButton").addClass("microphoneOn").removeClass("microphoneOff");
        // }
        console.log("SetMicrophonePrivacy Success");
    }).catch(function() {
        console.error("SetMicrophonePrivacy Failed");
    });
}

function hideCameraHandler(e){
    e.preventDefault();
    cameraPrivacy = !cameraPrivacy;
    vidyoConnector2.SetCameraPrivacy({
        privacy: cameraPrivacy
    }).then(function() {
        if (cameraPrivacy) {
            // $("#cameraButton").addClass("cameraOff").removeClass("cameraOn");
            console.log("camera privact changed", cameraPrivacy)
        } else {
            // $("#cameraButton").addClass("cameraOn").removeClass("cameraOff");
        }
        console.log("SetCameraPrivacy Success");
    }).catch(function() {
        console.error("SetCameraPrivacy Failed");
    });
}



function joinCallHandler(e) {
    e.preventDefault();
    const displayName = document.querySelector("input[name=name]").value;
    const roomName    = document.querySelector("input[name=room-name]").value;
    fetch("/token")
        .then(res => res.json())
        .then(function(data){
            const token = data.token;
            connect(token, displayName, roomName);
        })
};

function connect(token, displayName, roomName) {
    VC.CreateVidyoConnector({
        viewId            : "video",                                    //div id where the video will be rendered
        viewStyle         : "VIDYO_CONNECTORVIEWSTYLE_Default",         //can be customized currently set to default
        remoteParticipants: 15,                                         //max number of participants
        logFileFilter     : "warning all@VidyoConnector info@VidyoClient",
        logFileName       : "",
        userData          : ""
    }).then(function(vidyoConnector){
        vidyoConnector2 = vidyoConnector;
        vidyoConnector.Connect({
            host          : "prod.vidyo.io",
            token         : token,
            displayName   : displayName,
            resourceId    : roomName,
            onSuccess     : function() {console.log("User Connected to video call")},
            onFailure     : function(reason) {console.log("Connection failed due to --", reason)},
            onDisconnected: function(reason) {console.log("Call disconnected", reason)}
        }).then(function(status){
            if(status) {
                console.log("ConnectCall success");
            } else {    
                console.error("ConnectCall failed")
            }
        }).catch(function(){
            console.error("CreateVidyoConnector Failed");
        });
    })
}

