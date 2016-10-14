(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("app.js", function(exports, require, module) {
'use strict';

var _fastclick = require('fastclick');

var _fastclick2 = _interopRequireDefault(_fastclick);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-base-apps');

require('angular-google-chart/ng-google-chart');

require('angular-ui-router');

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

require('angularfire');

var _configFirebase = require('./config/config-firebase');

var _configFirebase2 = _interopRequireDefault(_configFirebase);

require('angular-icons/dist/open-iconic');

require('angular-icons/dist/ionicons');

require('angular-icons/dist/material-icons');

require('angular-dynamic-routing/dynamicRouting');

require('angular-dynamic-routing/dynamicRouting.animations');

var _configRoutes = require('./config/config-routes');

var _configRoutes2 = _interopRequireDefault(_configRoutes);

var _modules = require('./modules');

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Angular Base Apps Configuration
_firebase2.default.initializeApp(_configFirebase2.default);

// Icon Configuration


// Firebase Configuration


// Route Configuration


// Application Configuration


var AppConfig = function AppConfig($urlProvider, $locationProvider, $firebaseRefProvider, $BaseAppsStateProvider) {
  $urlProvider.otherwise('/');

  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $firebaseRefProvider.registerUrl(_configFirebase2.default.databaseURL);

  $BaseAppsStateProvider.registerDynamicRoutes(_configRoutes2.default);
};

AppConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$firebaseRefProvider', '$BaseAppsStateProvider'];

var AppRun = function AppRun() {
  _fastclick2.default.FastClick.attach(document.body);
};

_angular2.default.module('application', ['ui.router', 'ngAnimate',

// firebase
'firebase',

// base apps
'base',

// google charts
'googlechart',

// icons
'angularIcons.openIconic', 'angularIcons.ionicons', 'angularIcons.materialIcons',

// dynamic routing
'dynamicRouting', 'dynamicRouting.animations'].concat(_modules2.default)).config(AppConfig).run(AppRun);
});

require.register("config/config-firebase.js", function(exports, require, module) {
'use strict';

module.exports = {
  apiKey: 'AIzaSyBkB1IvviOcPq4z8Rs7nijEdIa9n1IvRlU',
  authDomain: 'angular-firebase-template.firebaseapp.com',
  databaseURL: 'https://angular-firebase-template.firebaseio.com',
  storageBucket: ''
};
});

require.register("config/config-routes.js", function(exports, require, module) {
"use strict";

module.exports = [{ "name": "reporting", "url": "/reporting", "controller": "ReportingController as reporting", "path": "modules/reporting/reporting.html" }, { "name": "messaging", "url": "/messaging", "controller": "MessagingController as messaging", "animationIn": "slideInRight", "animationOut": "slideOutLeft", "path": "modules/messaging/messaging.html" }, { "name": "account", "url": "/account", "controller": "AccountController as account", "animationIn": "slideInLeft", "animationOut": "slideOutRight", "path": "modules/account/account.html" }, { "name": "home", "url": "/", "controller": "HomeController as home", "animationIn": "slideInRight", "animationOut": "slideOutLeft", "path": "modules/home/home.html" }];
});

require.register("modules/account/account-controller.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountController = function () {
  function AccountController($firebaseAuthService, $log, BaseAppsApi) {
    _classCallCheck(this, AccountController);

    this.authService = $firebaseAuthService;
    this.authLoading = false;
    this.$log = $log;
    this.BaseAppsApi = BaseAppsApi;
    return this;
  }

  _createClass(AccountController, [{
    key: 'signin',
    value: function signin(provider) {
      var _this = this;

      var $log = this.$log;
      var BaseAppsApi = this.BaseAppsApi;

      switch (provider) {
        case 'anonymous':
          this.authLoading = true;
          return this.authService.$signInAnonymously().catch(function (error) {
            $log.log('Login Failed!', error);
            BaseAppsApi.publish('account-notifications', {
              title: 'Anonymous Login Failed',
              content: error.message,
              color: 'alert'
            });
          }).finally(function () {
            return _this.authLoading = false;
          });
        case 'google':
        case 'twitter':
        case 'facebook':
        case 'github':
          this.authLoading = true;
          return this.authService.$signInWithPopup(provider).catch(function (error) {
            $log.log('Login Failed!', error);
            BaseAppsApi.publish('account-notifications', {
              title: provider.substr(0, 1).toUpperCase() + provider.substr(1) + ' Login Failed',
              content: error.message + (error.email ? ' (email: ' + error.email + ')' : ''),
              color: 'alert'
            });
          }).finally(function () {
            return _this.authLoading = false;
          });
        default:
          $log.log('Provider not supported: ' + provider);
          return null;
      }
    }
  }, {
    key: 'printUserInfo',
    value: function printUserInfo() {
      return JSON.stringify(this.authService.$getAuth(), null, 2);
    }
  }, {
    key: 'signout',
    value: function signout() {
      var _this2 = this;

      this.authLoading = true;
      return this.authService.$signOut().finally(function () {
        return _this2.authLoading = false;
      });
    }
  }]);

  return AccountController;
}();

exports.default = AccountController;


AccountController.$inject = ['$firebaseAuthService', '$log', 'BaseAppsApi'];
});

require.register("modules/account/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('firebase');

var _accountController = require('./account-controller');

var _accountController2 = _interopRequireDefault(_accountController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = angular.module('application.account', ['firebase.auth']).controller('AccountController', _accountController2.default).name;
});

require.register("modules/home/home-controller.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeController = function () {
  function HomeController($firebaseRef, $firebaseObject, $firebaseArray, $timeout) {
    _classCallCheck(this, HomeController);

    var self = this;
    var ref = void 0;

    ref = $firebaseRef.default.child('person');
    this.person = $firebaseObject(ref);
    ref = $firebaseRef.default.child('messages');
    this.messages = $firebaseArray(ref);

    this.messages.$resolved = false;
    this.messages.$loaded().then(function () {
      self.messages.$resolved = true;
    });

    // delay message rendering until after view animation
    var animationDelay = 750;
    this.showMessages = false;
    $timeout(function () {
      self.showMessages = true;
    }, animationDelay);

    return self;
  }

  _createClass(HomeController, [{
    key: 'submitMessage',
    value: function submitMessage(message) {
      this.messages.$add(message);
    }
  }, {
    key: 'updateName',
    value: function updateName(name) {
      this.person.name = name;
      this.person.$save();
    }
  }]);

  return HomeController;
}();

exports.default = HomeController;


HomeController.$inject = ['$firebaseRef', '$firebaseObject', '$firebaseArray', '$timeout'];
});

require.register("modules/home/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('firebase');

var _homeController = require('./home-controller');

var _homeController2 = _interopRequireDefault(_homeController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = angular.module('application.home', ['firebase.database']).controller('HomeController', _homeController2.default).name;
});

require.register("modules/index.js", function(exports, require, module) {
'use strict';

require('./account');

require('./home');

require('./messaging');

require('./reporting');

module.exports = ['application.account', 'application.home', 'application.messaging', 'application.reporting'];
});

require.register("modules/messaging/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('firebase');

var _messagingController = require('./messaging-controller');

var _messagingController2 = _interopRequireDefault(_messagingController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = angular.module('application.messaging', ['firebase.database']).controller('MessagingController', _messagingController2.default).name;
});

require.register("modules/messaging/messaging-controller.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeController = function () {
  function HomeController($firebaseRef, $firebaseObject, $firebaseArray, $timeout) {
    _classCallCheck(this, HomeController);

    var self = this;
    var ref = void 0;

    ref = $firebaseRef.default.child('person');
    this.person = $firebaseObject(ref);
    ref = $firebaseRef.default.child('messages');
    this.messages = $firebaseArray(ref);

    this.messages.$resolved = false;
    this.messages.$loaded().then(function () {
      self.messages.$resolved = true;
    });

    // delay message rendering until after view animation
    var animationDelay = 750;
    this.showMessages = false;
    $timeout(function () {
      self.showMessages = true;
    }, animationDelay);

    return self;
  }

  _createClass(HomeController, [{
    key: 'submitMessage',
    value: function submitMessage(message) {
      this.messages.$add(message);
    }
  }, {
    key: 'updateName',
    value: function updateName(name) {
      this.person.name = name;
      this.person.$save();
    }
  }]);

  return HomeController;
}();

exports.default = HomeController;


HomeController.$inject = ['$firebaseRef', '$firebaseObject', '$firebaseArray', '$timeout'];
});

require.register("modules/reporting/index.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reportingController = require('./reporting-controller');

var _reportingController2 = _interopRequireDefault(_reportingController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = angular.module('application.reporting', ['firebase.database']).controller('ReportingController', _reportingController2.default).name;
});

require.register("modules/reporting/reporting-controller.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebaseReporting = require('firebase-reporting');

var _firebaseReporting2 = _interopRequireDefault(_firebaseReporting);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReportingController = function () {
  function ReportingController($firebaseRef, $firebaseAuth, $firebaseArray, $timeout, $q) {
    var _this = this;

    _classCallCheck(this, ReportingController);

    this.authService = $firebaseAuth(_firebase2.default.auth());
    this.$timeout = $timeout;
    this.$q = $q;
    this.authLoaded = false;
    this.totalClicks = null;
    this.totalUsers = null;
    this.lastClicked = null;
    this.data = $firebaseArray($firebaseRef.default.child('data'));
    this.reportingService = new _firebaseReporting2.default({
      firebase: $firebaseRef.default.child('reporting')
    });

    this.authService.$requireSignIn().then(function () {
      return _this.init();
    }).catch(function () {
      return _this.authService.$signInAnonymously().then(function () {
        return _this.init();
      });
    });

    this.piechart = {
      type: 'PieChart',
      data: {
        'cols': [{ label: 'Button', type: 'string' }, { label: 'Times Clicked', type: 'number' }],
        'rows': []
      },
      options: {
        legend: {
          position: 'bottom'
        }
      }
    };
    this.linecharts = {};
    this.linecharts.minute = {
      type: 'LineChart',
      data: {
        'cols': [{ label: 'Time', type: 'date' }, { label: 'A', type: 'number' }, { label: 'B', type: 'number' }, { label: 'C', type: 'number' }, { label: 'D', type: 'number' }],
        'rows': []
      },
      options: {
        title: 'Clicked this Hour',
        legend: {
          position: 'bottom'
        }
      }
    };
    this.linecharts.hour = {
      type: 'LineChart',
      data: {
        'cols': [{ label: 'Time', type: 'date' }, { label: 'A', type: 'number' }, { label: 'B', type: 'number' }, { label: 'C', type: 'number' }, { label: 'D', type: 'number' }],
        'rows': []
      },
      options: {
        title: 'Clicked Today',
        legend: {
          position: 'bottom'
        }
      }
    };
    this.linecharts.day = {
      type: 'LineChart',
      data: {
        'cols': [{ label: 'Time', type: 'date' }, { label: 'A', type: 'number' }, { label: 'B', type: 'number' }, { label: 'C', type: 'number' }, { label: 'D', type: 'number' }],
        'rows': []
      },
      options: {
        title: 'Clicked this Month',
        legend: {
          position: 'bottom'
        }
      }
    };
    this.linecharts.week = {
      type: 'LineChart',
      data: {
        'cols': [{ label: 'Time', type: 'date' }, { label: 'A', type: 'number' }, { label: 'B', type: 'number' }, { label: 'C', type: 'number' }, { label: 'D', type: 'number' }],
        'rows': []
      },
      options: {
        title: 'Clicked this Year',
        legend: {
          position: 'bottom'
        }
      }
    };

    return this;
  }

  _createClass(ReportingController, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.authLoaded = true;
      this.initReportingService();
      this.data.$watch(function () {
        return _this2.drawAll();
      });
      this.drawAll();
    }
  }, {
    key: 'buttonClicked',
    value: function buttonClicked(button) {
      var _this3 = this;

      var data = {
        uid: this.authService.$getAuth().uid,
        timestamp: _firebase2.default.database.ServerValue.TIMESTAMP,
        anyclicked: 1
      };
      data[button + 'clicked'] = 1;

      // save metrics first to ensure onDataSaved callback
      // is called after metrics have been calculated
      this.reportingService.saveMetrics(data).then(function () {
        _this3.data.$add(data);
      });
    }
  }, {
    key: 'drawAll',
    value: function drawAll() {
      this.drawMetrics();
      this.drawCharts();
    }
  }, {
    key: 'drawMetrics',
    value: function drawMetrics() {
      var _this4 = this;

      this.reportingService.filter().sum('anyclicked').select(1).then(function (values) {
        _this4.$timeout(function () {
          return _this4.totalClicks = values[0] || 0;
        });
      });
      this.reportingService.filter('users').sum('anyclicked').count().then(function (value) {
        _this4.$timeout(function () {
          return _this4.totalUsers = value || 0;
        });
      });
      this.reportingService.filter().last('timestamp').select(1).then(function (values) {
        _this4.$timeout(function () {
          return _this4.lastClicked = values[0] ? values[0] : null;
        });
      });
    }
  }, {
    key: 'drawCharts',
    value: function drawCharts() {
      this.drawPieChart();
      this.drawLineChart('minute');
      this.drawLineChart('hour');
      this.drawLineChart('day');
      this.drawLineChart('week');
    }
  }, {
    key: 'drawPieChart',
    value: function drawPieChart() {
      var _this5 = this;

      var aClickedQuery = this.reportingService.filter().sum('aclicked').value();
      var bClickedQuery = this.reportingService.filter().sum('bclicked').value();
      var cClickedQuery = this.reportingService.filter().sum('cclicked').value();
      var dClickedQuery = this.reportingService.filter().sum('dclicked').value();

      this.$q.all([aClickedQuery, bClickedQuery, cClickedQuery, dClickedQuery]).then(function (values) {
        _this5.$timeout(function () {
          _this5.piechart.data.rows.splice(0, _this5.piechart.data.rows.length);
          _this5.piechart.data.rows.push({ c: [{ v: 'A' }, { v: values[0] }] });
          _this5.piechart.data.rows.push({ c: [{ v: 'B' }, { v: values[1] }] });
          _this5.piechart.data.rows.push({ c: [{ v: 'C' }, { v: values[2] }] });
          _this5.piechart.data.rows.push({ c: [{ v: 'D' }, { v: values[3] }] });
        });
      });
    }
  }, {
    key: 'drawLineChart',
    value: function drawLineChart(during) {
      var _this6 = this;

      var queryStartTime = new Date();
      var queryEndTime = new Date();
      queryStartTime.setMilliseconds(0);
      queryStartTime.setSeconds(0);
      queryStartTime.setMinutes(0);

      switch (during) {
        case 'minute':
          queryEndTime.setTime(queryStartTime.getTime());
          queryEndTime.setHours(queryStartTime.getHours() + 1);
          break;
        case 'hour':
          queryStartTime.setHours(0);
          queryEndTime.setTime(queryStartTime.getTime());
          queryEndTime.setDate(queryStartTime.getDate() + 1);
          break;
        case 'day':
          queryStartTime.setHours(0);
          queryStartTime.setDate(1);
          queryEndTime.setTime(queryStartTime.getTime());
          queryEndTime.setMonth(queryStartTime.getMonth() + 1);
          break;
        case 'week':
          queryStartTime.setHours(0);
          queryStartTime.setDate(1);
          queryStartTime.setMonth(1);
          queryEndTime.setTime(queryStartTime.getTime());
          queryEndTime.setFullYear(queryStartTime.getFullYear() + 1);
          break;
      }

      var aClickedQuery = this.reportingService.filter().sum('aclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);
      var bClickedQuery = this.reportingService.filter().sum('bclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);
      var cClickedQuery = this.reportingService.filter().sum('cclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);
      var dClickedQuery = this.reportingService.filter().sum('dclicked').during(during).range(queryStartTime.getTime(), queryEndTime.getTime()).values(true);

      this.$q.all([aClickedQuery, bClickedQuery, cClickedQuery, dClickedQuery]).then(function (values) {
        _this6.linecharts[during].data.rows.splice(0, _this6.linecharts[during].data.rows.length);
        for (var i = 0; i < values[0].length; i++) {
          _this6.linecharts[during].data.rows.push({
            c: [{
              v: new Date(values[0][i].timestamp)
            }, {
              v: values[0][i].value
            }, {
              v: values[1][i].value
            }, {
              v: values[2][i].value
            }, {
              v: values[3][i].value
            }]
          });
        }
      });
    }
  }, {
    key: 'initReportingService',
    value: function initReportingService() {
      // Add report filter for users
      this.reportingService.addFilter('users', ['uid']);

      // Metrics for timing
      this.reportingService.addMetric('timestamp', ['first', 'last']);

      // Metrics for ANY button clicked
      this.reportingService.addMetric('anyclicked', ['sum']);
      this.reportingService.enableRetainer('minute', 'anyclicked', ['sum']);
      this.reportingService.enableRetainer('hour', 'anyclicked', ['sum']);
      this.reportingService.enableRetainer('day', 'anyclicked', ['sum']);
      this.reportingService.enableRetainer('week', 'anyclicked', ['sum']);

      // Metrics for A button clicked
      this.reportingService.addMetric('aclicked', ['sum']);
      this.reportingService.enableRetainer('minute', 'aclicked', ['sum']);
      this.reportingService.enableRetainer('hour', 'aclicked', ['sum']);
      this.reportingService.enableRetainer('day', 'aclicked', ['sum']);
      this.reportingService.enableRetainer('week', 'aclicked', ['sum']);

      // Metrics for B button clicked
      this.reportingService.addMetric('bclicked', ['sum']);
      this.reportingService.enableRetainer('minute', 'bclicked', ['sum']);
      this.reportingService.enableRetainer('hour', 'bclicked', ['sum']);
      this.reportingService.enableRetainer('day', 'bclicked', ['sum']);
      this.reportingService.enableRetainer('week', 'bclicked', ['sum']);

      // Metrics for C button clicked
      this.reportingService.addMetric('cclicked', ['sum']);
      this.reportingService.enableRetainer('minute', 'cclicked', ['sum']);
      this.reportingService.enableRetainer('hour', 'cclicked', ['sum']);
      this.reportingService.enableRetainer('day', 'cclicked', ['sum']);
      this.reportingService.enableRetainer('week', 'cclicked', ['sum']);

      // Metrics for D button clicked
      this.reportingService.addMetric('dclicked', ['sum']);
      this.reportingService.enableRetainer('minute', 'dclicked', ['sum']);
      this.reportingService.enableRetainer('hour', 'dclicked', ['sum']);
      this.reportingService.enableRetainer('day', 'dclicked', ['sum']);
      this.reportingService.enableRetainer('week', 'dclicked', ['sum']);
    }
  }]);

  return ReportingController;
}();

exports.default = ReportingController;


ReportingController.$inject = ['$firebaseRef', '$firebaseAuth', '$firebaseArray', '$timeout', '$q'];
});

require.alias("brunch/node_modules/deppack/node_modules/node-browser-modules/node_modules/process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map