'use strict';

angular.module('task2').controller('MyCtrl', ['$scope','$http','$log','$uibModal',function($scope,$http,$log,$uibModal) {
    
    // This provides Authentication context.
    //$scope.name="madhur";

    
    
  $scope.modules = [
    'RGB2Grayscale',
    'Smoothen',
    'Edge Detection',
    'Sobel Filter',
    'Binary Threshold',
    'Resize'
  ];

  $scope.moduleParams = [
    {},
    {"width":null,"height":null},
    {"minVal":null,"maxVal":null},
    {"ddepth":null,"xorder":null,"yorder":null,"ksize":null},
    {"thresholdValue":null,"maxVal":null},
    {"height":null,"width":null,"interpolation":null},
  ];

  $scope.resizeInterpolationTypes=["INTER_CUBIC","INTER_LINEAR","INTER_AREA"];
  $scope.sobelDdepthTypes=["CV_64F"];

  $scope.modulePipeline=['Input'];

  $scope.selectedModule='None';

  $scope.pipeline=[];

  $scope.wait=false;

  $scope.addModule=function(index){
    $scope.modulePipeline.push($scope.modules[index]);
    $scope.pipeline.push({name:$scope.modules[index],params:$scope.moduleParams[index]});//this is awesome
  }

  $scope.setParams=function(index){
    $scope.selectedModule=$scope.modulePipeline[index];
  }

  $scope.resultUrls=[];

  $scope.sampleFile=null;

  $scope.sampleImageSelected=false;

  $scope.showErrorMessage=false;

  $scope.sampleImageUpload=function(url){

    $http.get(url,{responseType: "blob"}).success((data) => {
      var file = new File([data], "sample.jpg");
      $scope.sampleFile=file;
      $scope.sampleImageSelected=true;
    });
  }



  $scope.openImageModal= function (index) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        url: function () {
          return $scope.resultUrls[index];
        },
        title: function () {
          if(index>0){
            return $scope.pipeline[index-1].name;
          }
          else{
            return "Input"
          }
        }
      }
    });
  };

  $scope.imageSelectedName=null;
  $scope.imageSelected=false;

   $scope.uploadFileChanged = function(event){
        var filename = event.target.files[0].name;
        $scope.imageSelected=true;
        $scope.imageSelectedName=filename;
        $scope.$apply();
  };

  
  $scope.uploadFile = function(){
        $scope.wait=true;
        var file = $scope.myFile;

        if($scope.sampleFile){
          file = $scope.sampleFile;
        }
    
        var uploadUrl = "/upload";
        var fd = new FormData();
        fd.append('file', file);
        fd.append('pipe',JSON.stringify({pipeline:$scope.pipeline}));

        $http.post(uploadUrl,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response){
          console.log("success!!");
          console.log(response.urls);
          $scope.postError=null;
          $scope.resultUrls=response.urls;
          $scope.wait=false;
          $scope.showErrorMessage=false;
        })
        .error(function(error){
          console.log(error);
          $scope.postError="ERROR: "+error;
          $scope.wait=false;
          $scope.showErrorMessage=true;
        });
    };






    

}]);

angular.module('task2').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, url,title) {

  
  $scope.url=url;
  $scope.modaltitle=title+ " Module";

  $scope.back = function () {
    $uibModalInstance.close();
  };
});


