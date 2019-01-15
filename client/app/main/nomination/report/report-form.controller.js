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
  
  function xmlToJson(xml) {
    // Create the return object
    var obj = {};
  
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
  
    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

  labsService.all().then(function (data) {// search for the xml file
    self.apps = xmlToJson(data).rss.channel.item;
    self.apps.forEach(function (app) {
        app.id = app.id['#text'];
        app.title = app.title['#text'];
        app.lang = app.lang['#text'];
    });
    self.apps = self.apps.filter(function(item,index,array){
        return (item.lang === 'en');
    });
  });

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
    return query ? self.apps.filter(function (item) {
      return item && (item.title.toLowerCase().indexOf(query) !== -1 || item.id.toLowerCase().indexOf(query) !== -1);
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
