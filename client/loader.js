/*global document, window, angular*/
(function () {
  'use strict';

  require.config({
    baseUrl: 'assets/js',
    paths: {
      jquery: 'jquery-3.3.1.min'
    }
  });

  require(['jquery'], function (jq) {
    var deps;

    var base = '/labs/cplant/';
    if (!window.LABS_DEBUG) {
      deps = [
        'app/vendor.js',
        'app/app.js',
      ];
    } else {
      deps = window.deps.map(function (dep) {
        return base + dep + '.js';
      });
    }
    // keep track of deferreds we are loading
    var dfds = [];
    var qLoad = function (mod, index) {
      var previousDfd = dfds[index - 1];
      dfds[index] = new jq.Deferred();
      var _load = function () {
        require(mod.split(), function () {
          dfds[index].resolve();
        });
      };
      if (previousDfd) {
        // We have a previous mod loading, chain the next load
        previousDfd.then(_load);
      } else {
        // First module being loaded. Fire away
        _load();
      }
      return dfds[index].promise();
    };
    // Queue up loading of modules
    var i = 0;
    for (i = 0; i < deps.length; i = i + 1) {
      qLoad(deps[i], i);
    }
    // Once all modules have loaded bootstrap it
    jq.when.apply(jq, dfds).then(function () {
      // Bootstrap angular app
      angular.bootstrap(document, ['cplantApp']);
      // Fade in main element
      jq('#cplant').fadeIn();
    });
  });
})();
