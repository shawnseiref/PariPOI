var app = angular.module("ourapp", ["ngRoute"]);
app.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when("/", {
            templateUrl: "content/home.html",
            controller: "homeCtrl",
            controllerAs: "ctrl"
        })
        .when("/login", {
            templateUrl: "content/login.html",
            controller: "loginCtrl",
            controllerAs: "ctrl"
        })
        .when("/restorePassword", {
            templateUrl: "content/restorePassword.html",
            controller: "restorePasswordCtrl",
            controllerAs: "ctrl"
        })
        .when("/register", {
            templateUrl: "content/register.html",
            controller: "registerCtrl",
            controllerAs: "ctrl"
        })
        .when("/favorites", {
            templateUrl: "content/favorites.html",
            controller: "favoritesCtrl",
            controllerAs: "ctrl"
        })
        .when("/allpois", {
            templateUrl: "content/POIs.html",
            controller: "POIsCtrl",
            controllerAs: "ctrl"
        })
        .when("/poiview", {
            templateUrl: "content/poiView.html",
            controller: "poiViewCtrl",
            controllerAs: "ctrl"
        })
        .when("/addReview", {
            templateUrl: "content/addReview.html",
            controller: "addReviewCtrl",
            controllerAs: "ctrl"
        })
        .when("/about", {
            templateUrl: "content/about.html",
            controller: "aboutCtrl",
            controllerAs: "ctrl"
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller("mainController", ($scope, $http, $window) => {

    //global variables
    $scope.userData = localStorage.getItem("userData");
    $scope.loggedIn = $scope.userData !== null;
    $scope.localFav = [];
    $scope.countries = [];
    $scope.questions = [];
    $scope.allPois = [];
    $scope.categories = [];
    $scope.viewedPoiName = {};


    $http.get("http://localhost:3000/Authentication/ParametersForRegistration")
        .then((res) => {
            $scope.countries = res.data['countries'];
            localStorage.setItem("countries", JSON.stringify($scope.countries));
            $scope.questions = res.data['questions'];
            localStorage.setItem("questions", JSON.stringify($scope.questions));
            $scope.categories = res.data['categories'];
            localStorage.setItem("categories", JSON.stringify($scope.categories));
        }).catch((err) => {
        console.log(err);
    });

    try {
        $scope.allPois = JSON.parse(localStorage.getItem("allPois"));
        if ($scope.allPois.length < 34) {
            JSON.parse(undefined);
        }
    } catch {
        let getAllPOIsReq = {
            method: "GET",
            url: "http://localhost:3000/else/getAllPOIs"
        };
        $http(getAllPOIsReq)
            .then((res) => {
                $scope.allPois = res.data['POIs'];
                localStorage.setItem("allPois", $scope.allPois);
            }).catch((err) => {
            console.log(err);
        });
    }

    //pre-functoions for logged-in users
    if ($scope.loggedIn) {
        $scope.userData = JSON.parse($scope.userData);
        $scope.username = $scope.userData['username'];
        $scope.dbFav = [];
        try {
            $scope.localFav = localStorage.getItem("localFav");
            // console.log("try: $scope.localFav: " + $scope.localFav);
            $scope.hasFav = localFav.length > 0;
        } catch {
            // console.log("catch: $scope.localFav: " + $scope.localFav);
            $scope.localFav = [];
            $scope.hasFav = false
        }


        let favoritesReq = {
            method: "POST",
            url: "http://localhost:3000/Analysis/getFavoritePOIs",
            headers: {
                "x-auth-token": $scope.userData["token"],
                "Content-Type": "application/json"
            }
        };

        $http(favoritesReq)
            .then((res) => {
                const l = res.data['response'].length - 1;//todo - delete

                for (let i = 0; i < res.data['response'].length; i++) {
                    let id = res.data['response'][i]['poiID'];
                    let pos = res.data['response'][i]['position'];
                    let poiReq = {
                        method: "GET",
                        url: "http://localhost:3000/else/getPOIbyID/" + id,
                    };
                    $http(poiReq)
                        .then((res) => {
                            // console.log(res);
                            // console.log(res.data);
                            if (!$scope.localFav.includes(res.data['POI'][name])) {
                                res.data['POI']['position'] =
                                    $scope.dbFav.push(res.data['POI']);
                                $scope.localFav.push(res.data['POI']);
                                localStorage.setItem("favNum", l + 1);
                                localStorage.setItem("localFav", JSON.stringify($scope.localFav));
                                // localStorage.setItem("dbFav", $scope.dbFav);
                                localStorage.setItem("dbFav", JSON.stringify($scope.dbFav));
                                $scope.favNum = localStorage.getItem("favNum");
                            }

                            /*** Prints ***/
                            if (i === l) {
                                // console.log("local: " + JSON.stringify($scope.localFav));
                                // console.log("db: " + JSON.stringify($scope.dbFav));
                                // console.log("db: " + $scope.dbFav);
                            }

                        }).catch((err) => {
                        console.log(err);
                    });
                }
            }).catch((err) => {
            if (err.status === 404) {
                $scope.favNum = 0;
                localStorage.setItem("favNum", 0);
                localStorage.setItem("localFav", "");
                localStorage.setItem("dbFav", "");
            } else {
                console.log("err " + JSON.stringify(err));
            }
        });
    }


    $scope.like = function (event) {
        let id = event.path[1].id;
        // console.log(id);
        if (!event.path[1].id) {
            id = event.path[0].name;
            // console.log(id);
        }
        if (!$scope.localFav.find(p => p['name'] === id)) {
            $scope.localFav.push($scope.allPois.find(p => p['name'] === id));
        } else {
            $scope.localFav.splice($scope.localFav.find(p => p['name'] === id), 1);
        }
        $scope.favNum = $scope.localFav.length;
        localStorage.setItem("favNum", JSON.stringify($scope.favNum));
        localStorage.setItem("localFav", JSON.stringify($scope.localFav));
        // console.log(id);
        // console.log("lcl: " + JSON.stringify($scope.localFav));
    };

    // $scope.signOut = function() {
    //     loginService.signOut();
    //     $rootScope.object = { userNameIndex: "guest" , isLoggedIndex: false  }
    //   };

    //todo - implement functions

    // $scope.allPois = JSON.parse(localStorage.getItem("allPois"));
    // localStorage.removeItem("allPois");
    // console.log("localStorage:\n" + JSON.stringify(localStorage));
    // localStorage.setItem("allPois", $scope.allPois);


    $scope.findFav = function (name) {
        // console.log(name);
        return $scope.localFav.find(poi => poi['name'] === name) === undefined;
    };

    $scope.viewPOI = function (poi) {
        // console.log(poi);
        $scope.viewedPoiName = poi;
        $window.location.href = "#!/poiview";
    }
});


function logout() {
    loggedIn = false;
    // localStorage.removeItem("userData");
    // localStorage.removeItem("usersFavouritePOIs");
    for (let localStorageKey in localStorage) {
        localStorage.removeItem(localStorageKey);
    }
    location.href = "/index.html";
}
