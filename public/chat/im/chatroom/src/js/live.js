var cameraList,
  microPhoneList,
  cameraOptions = '',
  microPhoneOptions = '';
var publishBtn = document.getElementById('publishBtn');
var previewBtn = document.getElementById('previewBtn')
var testInput = document.getElementsByClassName('u-input');
var myPublisher = new nePublisher('my-publisher', {
  //viewOptions
  videoWidth: 540,
  videoHeight: 960,
  fps: 20,
  bitrate: 1500
}, {
  //flashOptions
  previewWindowWidth: 745,
  previewWindowHeight: 453,
  wmode: 'transparent',
  quality: 'high',
  allowScriptAccess: 'always'
}, function () {
  cameraList = this.getCameraList();
  microPhoneList = this.getMicroPhoneList();
  console.log(cameraList, microPhoneList);
  for (var i = cameraList.length - 1; i >= 0; i--) {
    cameraOptions = '<option value="' + i + '">' + cameraList[i] + '</option>' + cameraOptions;
  }
  for (var i = microPhoneList.length - 1; i >= 0; i--) {
    microPhoneOptions = '<option value="' + i + '">' + microPhoneList[i] + '</option>' + microPhoneOptions;
  }
  document.getElementById("cameraSelect").innerHTML = cameraOptions;
  document.getElementById("microPhoneSelect").innerHTML = microPhoneOptions;
}, function (code, desc) {
  console.log(code, desc);
});
var qualityList = [
  {
    //流畅
    fps: 20,
    bitrate: 600,
    videoWidth: 360,
    videoHeight: 480
  },
  {
    //标清
    fps: 20,
    bitrate: 800,
    videoWidth: 480,
    videoHeight: 640
  },
  {
    //高清
    fps: 20,
    bitrate: 1500,
    videoWidth: 540,
    videoHeight: 960
  }
];
var getCameraIndex = function () {
  var cameraSelect = document.getElementById("cameraSelect");
  var cameraIndex = cameraSelect.selectedIndex;
  return cameraSelect.options[cameraIndex].value;
};
var getMicroPhoneIndex = function () {
  var microPhoneSelect = document.getElementById("microPhoneSelect");
  var microPhoneIndex = microPhoneSelect.selectedIndex;
  return microPhoneSelect.options[microPhoneIndex].value;
};
var getQualityOption = function () {
  var qualitySelect = document.getElementById("qualitySelect");
  var qualityIndex = qualitySelect.selectedIndex;
  return qualityList[qualityIndex];
};
var startPreview = function () {
  myPublisher.startPreview(getCameraIndex());
  document.getElementsByClassName('u-status')[0].innerHTML = '预览中';
};
var startPublish = function () {
  var publishUrl = document.getElementById("publishUrl").value;
  startPublishCall();
  myPublisher.setCamera(getCameraIndex());
  myPublisher.setMicroPhone(getMicroPhoneIndex());
  myPublisher.startPublish(publishUrl, getQualityOption(), function (code, desc) {
    console.log(code, desc);
    alert(code + '：' + desc);
    stopPublishCall();
  });
};
var stopPublish = function () {
  myPublisher.stopPublish();
  stopPublishCall();
};
var startPublishCall = function () {
  console.log('推流开始');
  document.getElementsByClassName('u-status')[0].innerHTML = '直播中';
  publishBtn.innerHTML = '停止直播';
  publishBtn.onclick = stopPublish;
  for (var i = testInput.length - 1; i >= 0; i--) {
    testInput[i].disabled = true;
  }
  previewBtn.disabled = true;

};
var stopPublishCall = function () {
  console.log('推流结束');
  document.getElementsByClassName('u-status')[0].innerHTML = '预览中';
  publishBtn.innerHTML = '开始直播';
  publishBtn.onclick = startPublish;
  for (var i = testInput.length - 1; i >= 0; i--) {
    testInput[i].disabled = false;
  }
  previewBtn.disabled = false;
};
var publishUrl = util.getIdTag("publishUrl");
if(publishUrl) {
  $("#publishUrl").val(decodeURIComponent(publishUrl));
}
