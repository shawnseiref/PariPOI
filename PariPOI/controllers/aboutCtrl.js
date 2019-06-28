angular
    .module("ourapp")
    .controller("aboutCtrl", function ($scope, $http, $window) {

        $scope.aboutP = [];

        let req = {
            method: "GET",
            url: "http://localhost:3000/else/getRandomPOI/9/0",
        };

        $http(req)
            .then((res) => {
                // console.log(res);
                // console.log(res.data);
                $scope.aboutP = res.data['POIs'];
            }).catch((err) => {
            console.log(err);

        });

    });