angular
    .module("ourapp")
    .controller("homeCtrl", function ($scope, $http, $window) {
        $scope.randomPois = [];
        $scope.popularPois = [];
        $scope.lastSavedPois = [];


        let req = {
            method: "GET",
            url: "http://localhost:3000/else/getRandomPOI/3/3",
        };

        $http(req)
            .then((res) => {
                $scope.randomPois = res.data['POIs'];
            }).catch((err) => {
            console.log(err);

        });

        // $scope.popularPOIShow = function () {
        if ($scope.loggedIn) {
            // console.log("show");
            let req2 = {
                method: "POST",
                url: "http://localhost:3000/Analysis/getTwoPOIsByCategories",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": $scope.userData["token"]
                }

            };

            $http(req2)
                .then((res) => {
                    // console.log(res);
                    // console.log(res.data);
                    for (let i = 0; i < res.data['POIs'].length; i++) {
                        $scope.popularPois.push(res.data['POIs'][i]);
                    }
                }).catch((err) => {
                console.log(err);

            });


            let req3 = {
                method: "POST",
                url: "http://localhost:3000/Analysis/getLastUsedPOIs",
                headers: {
                    "Content-Type": "application/json"
                    , "x-auth-token": $scope.userData['token']
                },
                data: {numOfPOIs: 2}
            };

            $http(req3)
                .then((res) => {
                    // console.log(res);
                    // console.log(res.data);
                    for (let i = 0; i < res.data['POIs'].length; i++) {
                        $scope.lastSavedPois.push(res.data['POIs'][i]);
                    }
                }).catch((err) => {
                console.log(err);

            });
        }

        // };

    });
