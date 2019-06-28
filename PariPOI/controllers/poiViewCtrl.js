angular
    .module("ourapp")
    .controller("poiViewCtrl", function ($scope, $http, $window) {

        $scope.viewedPoi = {};

        $scope.reviews = [];

        // console.log($scope.viewedPoiName);
        let req = {
            method: "GET",
            url: "http://localhost:3000/else/getPOIbyID/" + $scope.viewedPoiName['poiID']
        };

        // console.log(req.url);
        $http(req)
            .then((res) => {
                // console.log(res);
                // console.log(res.data);
                //
                let req2 = {
                    method: "GET",
                    url: "http://localhost:3000/else/getReviews/2/" + res.data['POI']['poiID']

                };
                $http(req2)
                    .then((res2) => {
                        // console.log(res2.data['Reviews']);
                        $scope.viewedPoi = res.data['POI'];
                        $scope.reviews = res2.data['Reviews'];
                        for (let i = 0; i < $scope.reviews.length; i++) {
                            let dt = $scope.reviews[i]['date'];
                            // console.log(dt);
                            $scope.reviews[i]['date'] = new Date(dt).toUTCString();
                            // console.log($scope.reviews);

                        }
                    }).catch((err) => {

                    console.log(err);
                });
            }).catch((err) => {
            console.log(err);

        });

        $scope.addReview=function (event) {
            $window.location.href="#!/addReview";
        }


    });