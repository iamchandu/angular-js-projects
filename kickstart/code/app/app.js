(function(){
	var app = angular.module('kickstarter',["ngRoute","ngCookies","angularjs-crypto"]);

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
        templateUrl : "home.html",
        controller : "home",
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
  app.controller('headerctrl',[function($cookies,$rootScope){

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

   app.controller('home',['$http','$rootScope',function($http,$rootScope){
      var p = this; 
      p.searchData   = []; 
      p.sortType     = 'title'; 
      p.sortReverse  = false;    
      p.tab = {};
      p.detaldata = {};
      p.maintab = true;
      $http.get('http://starlord.hackerearth.com/kickstarter').success(function(data){
        data = JSON.parse(JSON.stringify(data).split('"amt.pledged":').join('"amt_pledged":'));
        data = JSON.parse(JSON.stringify(data).split('"end.time":').join('"end_time":'));
        data = JSON.parse(JSON.stringify(data).split('"num.backers":').join('"num_backers":'));
        data = JSON.parse(JSON.stringify(data).split('"percentage.funded":').join('"percentage_funded":'));
        data = JSON.parse(JSON.stringify(data).split('"s.no":').join('"sno":'));
        p.tab = data;
      });
      p.detailview = function(inds){
        p.detaldata = p.tab[inds];
        p.maintab = false;
      };
      p.backbt = function(){
        p.detaldata = {};
        p.maintab = true;
      };
   }]);

// *******************************************************
//================ End Home Page Controller ============== 
// *******************************************************

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

