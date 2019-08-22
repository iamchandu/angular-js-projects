(function(){
	var app = angular.module('ipl',["ngRoute","ngCookies","angularjs-crypto","angular.filter"]);
  var matches = [];
  var deliveries = [];
  var loading = false;
// ==================================================================
//************* Initilize Header and footer directives **************
// ==================================================================
  app.directive('header', function() {
      return {
          restrict: 'E', 
          templateUrl: 'head.html',
          controller : 'headerctrl',
      };
   	}
	);
	app.directive('footer', function() {
      return {
          restrict: 'E', 
          templateUrl: 'footer.html'
      };
   }
  );
// ==================================================================
// ****************** End Directives ********************************
// ==================================================================

//<<<<<<<<<<<<<<<<<<<<<<<========================>>>>>>>>>>>>>>>>>>>>
// ==================================================================
//*************************** Routing *******************************
// ==================================================================
  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "app/views/home.html",
        controller : "home",
    })
    .when("/viewmatches", {
        templateUrl : "app/views/viewmatches.html",
        //controller : "viewmatches",
    })
    .when("/viewteams", {
        templateUrl : "app/views/viewteams.html",
        //controller : "viewdelivers",
    })
    .when("/viewmatches/season/:ID", {
        templateUrl : "app/views/season.html",
        //controller : "viewdelivers",
    })
    .when("/match/:ID", {
        templateUrl : "app/views/match.html",
    })
    .otherwise({
        templateUrl : "error.html"
    });
  });
// ==========================================================
// ******************** End Routing *************************
// ==========================================================

// ***************************************************
// ============== Controllers Header And Footer ==============
// ***************************************************
  //============ Header controller ========================
  app.controller('headerctrl',['$http','$rootScope','$location',function($http,$rootScope,$location){
     var p = this; 
      $rootScope.loading = true;
      $http.get('source/matches.csv').success(function(allText){
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for ( var i = 1; i < allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          if (data.length == headers.length) {
            var tarr = {};
            for ( var j = 0; j < headers.length; j++) {
              tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
          }
        }
        $rootScope.matches = lines;
      });

      $http.get('source/deliveries.csv').success(function(allText){
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for ( var i = 1; i < allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          if (data.length == headers.length) {
            var tarr = {};
            for ( var j = 0; j < headers.length; j++) {
              tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
          }
        }
        $rootScope.deliveries = lines;
        $rootScope.loading = false;
      });
  }]);
  //=========== footer controller ============
  app.controller('footerc',function(){
    this.icns = [
      {
        "url" : "https://www.facebook.com/iamchandu.44",
        "value" : "Facebook",
        "icon" : "fa fa-facebook-official"
      },
      {
        "url" : "https://plus.google.com/u/0/115219714777838143815",
        "value" : "Google Plus",
        "icon" : "fa fa-google-plus-official"
      },
      {
        "url" : "https://www.linkedin.com/in/tammana-chandrasekhar-1619a255?trk=nav_responsive_tab_profile_pic",
        "value" : "Linked In",
        "icon" : "fa fa-linkedin-square"
      },
      
    ];
  });
// ***************************************************
// ============== End Header And Footer ==============
// ***************************************************


// ****************************************************
// ============= Home Page Controller =================
// ****************************************************

   app.controller('home',['$http','$rootScope','$location',function($http,$rootScope,$location){
     
      //$location.path( "#dashboard" );
   }]);

// *******************************************************
//================ End Home Page Controller ============== 
// *******************************************************
//=================== Show Dashboard ====================
app.controller('dashboard',['$http','$rootScope',function($http,$rootScope){
  p = this;
  p.matches = $rootScope.matches;    
}]);

app.controller('viewmatches',['$http','$rootScope',function($http,$rootScope){
  p = this;
  p.matches = $rootScope.matches;
  p.sortType     = 'season'; 
  p.sortReverse  = false;  
  p.searchData   = []; 
}]);
app.controller('viewteams',['$http','$rootScope',function($http,$rootScope){
  p = this;
  p.matches = $rootScope.matches;
}]);
app.controller('season',['$http','$rootScope','$routeParams','$filter',function($http,$rootScope,$routeParams,$filter){
  p = this;
  p.ses = $routeParams.ID;
  //p.matches = $rootScope.matches;
  p.sess = $filter('filter')($rootScope.matches, {season: p.ses});
  //console.log(p.sess);
}]);
app.controller('match',['$http','$rootScope','$routeParams','$filter',function($http,$rootScope,$routeParams,$filter){
  p = this;
  p.matchid = $routeParams.ID;
  p.matchdetails = $filter('filter')($rootScope.matches, {id: p.matchid})[0];
  p.matchoverview = $filter('filter')($rootScope.deliveries, {match_id: p.matchid});
  p.matchfours = $filter('filter')(p.matchoverview, {batsman_runs: 4});
  p.matchsixes = $filter('filter')(p.matchoverview, {batsman_runs: 6});
  //p.matchouts = $filter('filter')(p.matchoverview, {player_dismissed : '!'});
  //console.log(p.matchfours);
}]);

//==================== End Dashboard ====================
//==================================================================================================
//+++++++++++++++++++++++++++++++ End controllers ++++++++++++++++++++++++++++++++++++++++++++++++++
//==================================================================================================
// ***************************************************
//=================== Services ======================
// ***************************************************
//============= encryption service ===================
app.service('EncryptData',['$rootScope', function ($rootScope) {
  this.encrypt = function (source) {
    $rootScope.key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
	  $rootScope.iv = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
      var paddingChar = ' ';
      var size = 16;
      var x = source.length % size;
      var padLength = size - x;
      
      for (var i = 0; i < padLength; i++) source += paddingChar;
      
      var encrypted = CryptoJS.AES.encrypt(
                      source,
                      $rootScope.key,
                      { iv: $rootScope.iv }
      );
		
			 return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    };
  }]);

  //==========================================
})();

