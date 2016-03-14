'use strict';

angular.module('task2').controller('MyCtrl1', ['$scope','$http','$log','$uibModal',function($scope,$http,$log,$uibModal) {
    
$scope.flowchart=[];
$scope.flowchartid=0;
$scope.id=null;
$scope.inputs=new Array();

$scope.moduleParams ={
	"input":{},
	"output":{},
    "rgb2grayscale":{},
    "image_blending":{"weight":0.7},
    "smoothen":{"width":5,"height":5},
    "edge_detection":{"minVal":100,"maxVal":200},
    "sobel_filter":{"ddepth":null,"xorder":1,"yorder":0,"ksize":5},
    "binary_threshold":{"thresholdValue":127,"maxVal":255},
    "resize":{"height":300,"width":300,"interpolation":null},
 };

 $scope.moduleAnchors ={
	"input":[["BottomCenter"], []],
	"output":[[],["TopCenter"]],
    "rgb2grayscale":[["BottomCenter"],["TopCenter"]],
    "image_blending":[["BottomCenter"],[[0.25,0,0,-1],[0.75,0,0,-1]]],
    "smoothen":[["BottomCenter"],["TopCenter"]],
    "edge_detection":[["BottomCenter"],["TopCenter"]],
    "sobel_filter":[["BottomCenter"],["TopCenter"]],
    "binary_threshold":[["BottomCenter"],["TopCenter"]],
    "resize":[["BottomCenter"],["TopCenter"]],
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
        var uploadUrl = "/uploadflowchart";
        var fd = new FormData();
        
        var keys = [];
		for (var key in $scope.inputs) {
		  if ($scope.inputs.hasOwnProperty(key)) {
		    keys.push(key);
		  }
		}

		for(var i=0;i<keys.length;i++){
			console.log($scope.inputs[keys[i]]);
			fd.append('file'+keys[i], $scope.inputs[keys[i]]);
		}





        if($scope.sampleFile){
          file = $scope.sampleFile;
          fd.append('file', file);
        }
    
        
        
        fd.append('flowchart',JSON.stringify({flowchart:$scope.flowchart}));

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
$scope.wait=false;

$scope.resultUrls=[];

  $scope.sampleFile=null;

  $scope.sampleImageSelected=false;

  $scope.showErrorMessage=false;


$scope.sampleImageUpload=function(url,i){
    console.log("GETTTTTTT");
    console.log(i);
    $http.get(url,{responseType: "blob"}).success((data) => {
      var file = new File([data], "sample.jpg");
      $scope.inputs[i]=file;
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
          return "Flowchart"
        }
      }
    });
  };







jsPlumb.ready(function () {

    var instance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                id:"ARROW",
                events:{
                    click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { alert("hey"); }
                }
            }]
        ],
        Container: "canvas"
    });

    var basicType = {

        paintStyle: { strokeStyle: "red", lineWidth: 4 },
        hoverPaintStyle: { strokeStyle: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);

    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
    // .. and this is the hover style.
        connectorHoverStyle = {
            lineWidth: 4,
            strokeStyle: "#216477",
            outlineWidth: 2,
            outlineColor: "white"
        },
        endpointHoverStyle = {
            fillStyle: "#216477",
            strokeStyle: "#216477"
        },
    // the definition of source endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                strokeStyle: "#7AB02C",
                fillStyle: "transparent",
                radius: 4,
                lineWidth: 3
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                [ "Label", {
                    location: [0.5, 1.5],
                    label: "Drag",
                    cssClass: "endpointSourceLabel",
                    visible:false
                } ]
            ]
        },
    // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fillStyle: "#7AB02C", radius: 5 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: 1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
            ]
        },
        init = function (connection) {
            console.log(connection.sourceId.substring(10));
            connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
        };

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        }
    };

    // suspend drawing and initialise.
    instance.batch(function () {

    	/*
        _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
        _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
        _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
        _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);
		*/
        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
        	var sourceid=connInfo.connection.sourceId.substring(7);
        	var targetid=connInfo.connection.targetId.substring(7);
        	$scope.flowchart[sourceid].outputs.push(parseInt(targetid));
        	$scope.flowchart[targetid].inputs.push(parseInt(sourceid));
            init(connInfo.connection);
            $scope.$apply();
        });

        instance.bind("connectionDetached", function (connInfo, originalEvent) {
        	console.log("i m called");
        	var sourceid=connInfo.connection.sourceId.substring(7);
        	var targetid=connInfo.connection.targetId.substring(7);
        	var index = $scope.flowchart[sourceid].outputs.indexOf(parseInt(targetid));
        	console.log(index);
        	if (index > -1) {
			    $scope.flowchart[sourceid].outputs.splice(index, 1);
			}
        	index = $scope.flowchart[targetid].inputs.indexOf(parseInt(sourceid));
        	console.log(index);
        	if (index > -1) {
			    $scope.flowchart[targetid].inputs.splice(index, 1);
			}
        	$scope.$apply();
        });




        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

        // connect a few up
        /*
        instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
        instance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
        instance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
        instance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
        instance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
        instance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
        */
        //

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", function (conn, originalEvent) {
           // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
             //   instance.detach(conn);
             console.log("click");
            conn.toggleType("basic");
        });

        instance.bind("connectionDrag", function (connection) {
            console.log("connectionDrag");
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("connectionDragStop");
            console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connectionMoved");
            console.log("connection " + params.connection.id + " was moved");
        });
    });
	
	var setParams=function(e){
		$scope.id=null;
		$scope.$apply();
		$scope.id=e.target.id.substring(7);
        $scope.imageSelectedName=null;
        $scope.imageSelected=false;
        $scope.sampleImageSelected=false;
		$scope.$apply();
	}
   
    
	var allowDrop=function(ev) {
	    ev.preventDefault();    }

	var drag=function(ev) {
		console.log(ev);
	    ev.dataTransfer.setData("text", ev.target.id);
	}

	var drop=function(ev) {
	    
	    ev.preventDefault();
	    console.log(ev);
	    
	    var src_id = ev.dataTransfer.getData("text");
	    console.log(src_id);
	    var src=document.getElementById(src_id);
	    console.log(src);

	    var div = document.createElement("div");
	    var id= "element"+$scope.flowchartid.toString();
	    div.className += " " + src.attributes["data-type"].nodeValue+" window";
	    $(div).css("top", (ev.offsetY -15) + 'px');
	    $(div).css("left", (ev.offsetX -75) + 'px');
	    div.innerHTML=src.attributes["data-detail"].nodeValue;
	    div.setAttribute("id", id);
	    div.addEventListener("dblclick",setParams,false);

	    $scope.flowchart.push({id:$scope.flowchartid,type:src.attributes["data-type"].nodeValue,detail:src.attributes["data-detail"].nodeValue,params:$scope.moduleParams[src.attributes["data-detail"].nodeValue],inputs:[],outputs:[]});

	  	ev.target.appendChild(div); 
	    
	    instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
	    _addEndpoints(id, $scope.moduleAnchors[src.attributes["data-detail"].nodeValue][0], $scope.moduleAnchors[src.attributes["data-detail"].nodeValue][1]);
	    
	    $scope.flowchartid++;
	    $scope.$apply();
	}
	jsPlumb.fire("jsPlumbDemoLoaded", instance);


	var cols = document.querySelectorAll('.element');
        [].forEach.call(cols, function(col) {
          col.addEventListener('dragstart', drag, false);
        });

    var canvas=document.getElementById("canvas");
    canvas.addEventListener('dragover',allowDrop,false);
    canvas.addEventListener('drop',drop,false);





});



}]);

