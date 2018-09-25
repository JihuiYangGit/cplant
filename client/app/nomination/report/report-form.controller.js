angular.module('cplantApp').controller('newBugCtrl', ['$scope','$mdDialog', '$mdToast', 'reportService', function ($scope, $mdDialog, $mdToast, reportService) {
  'use strict';
  var self = this;

  self.create = function (ev) {
    $mdDialog.show({
      controller: 'newReportCtrl',
      contentElement: '#newBugDialog',
      parent: angular.element('body'),
      targetEvent: ev,
      clickOutsideToClose: false,
    }).then(function (data) {
      // console.log(data);
      var report = data[0];
      var attachments = data[1];
      report.type = 'BUG';
      reportService.create(report, attachments)
        .then(function (result) {
          $scope.$emit("RequestsChange", result.data);
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });
    });
  };
}]).controller('newFeatureCtrl', ['$scope','$mdDialog', '$mdToast', 'reportService', function ($scope, $mdDialog, $mdToast, reportService) {
  'use strict';
  var self = this;


  self.create = function (ev) {
    $mdDialog.show({
      controller: 'newReportCtrl',
      contentElement: '#newFeatureDialog',
      parent: angular.element('body'),
      targetEvent: ev,
      clickOutsideToClose: false,
    }).then(function (data) {
     
       //console.log(data);
      var report = data[0];
      var attachments = data[1];
      report.type = 'FEATURE';
      reportService.create(report, attachments)
        .then(function (result) {
          $scope.$emit("RequestsChange", result.data);
          $mdToast.show($mdToast.simple()
            .textContent('Success!')
            .position('top right')
            .hideDelay(3000));
        });
    });
  };
}]).controller('newReportCtrl', ['$mdDialog', 'labsService', '$http', function ($mdDialog, labsService, $http) {
  'use strict';
  var self = this;

  self.apps = [];
  self.startProgress = false;

  // labsService.all().then(function (data) {// search for the json file
  //   self.apps = data;
  // });

var xhttp = new XMLHttpRequest();
var data = [];
var newdata = {};
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         showResult(xhttp.responseXML);
    }
};
xhttp.open("GET", "/feeds/labinfo", true);
xhttp.send(); 



function showResult(xml) {
    var txt = "";
    var path = "rss/channel/item/*"
    var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    while (result) {
        
        if(result.childNodes[0]){
            var tagName = result.nodeName;
            tagName = (tagName == 'title') ? 'name' : tagName ;
            var nodeValue = result.childNodes[0].nodeValue;
            txt += tagName + ":" + nodeValue + "<br>";
            newdata[tagName] = nodeValue;
        }
        if(result.nodeName == "type")
        {  
            txt += "<br>";
            data.push(newdata);
            newdata = new Object();

        }
        result = nodes.iterateNext();    
    }
     //console.log(data);
    self.apps = data;
}

  function init() {
    if(self.locals && self.locals.report) {
      self.report = Object.assign({}, self.locals.report);
      self.selectedApp = self.report.app;
    } else {
      self.selectedApp = null;
      self.searchText = '';
      self.report = {
        app: null,
        summary: '',
        desc: '',
      };
    }

    self.files = [];
  }

  init();

  self.querySearch = function (query) {
    query = query || '';
    query = query.toLowerCase();
    //console.log(self.apps);
    return query ? self.apps.filter(function (item) {
      return item && (item.name.toLowerCase().indexOf(query) !== -1 || item.id.toLowerCase().indexOf(query) !== -1);
    }) : self.apps;
  };

  self.removeUploadFile = function (f) {
    if (!self.files) {
      return;
    }
    var index = self.files.indexOf(f);
    if (index !== -1) {
      self.files.splice(index, 1);
    }
  };

  self.removeAttachment = function (f) {
    if (!self.report.attachments) {
      return;
    }

    var index = self.report.attachments.indexOf(f);
    if (index !== -1) {
      self.report.attachments.splice(index, 1);
    }
  };

  self.uploadFileNumber = function () {
    return self.files ? self.files.length : 0;
  };

  self.attachmentsNumber = function () {
    return self.report.attachments ? self.report.attachments.length : 0;
  };

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (reportForm) {
    self.startProgress = true;
    if (reportForm.$valid) {
      self.startProgress = false;
      $mdDialog.hide([self.report, self.files]).then(function () {
        self.reset(reportForm);
      });
    }
  };

  self.reset = function (reportForm) {
    reportForm.$setPristine();
    init();
  };
}]);
