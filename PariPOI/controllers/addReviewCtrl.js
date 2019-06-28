angular
    .module("ourapp")
    .controller("addReviewCtrl", function ($scope, $http, $window) {
        $scope.r = $scope.viewedPoiName;

        $scope.rev = {
            poiID: "",
            description: "",
            ranking: 0
        };

        $scope.choose = function (rank) {
            $scope.rev.ranking = rank;
        };

        $scope.add = function (event) {
            $scope.rev.description = $scope.desc;
            $scope.rev.poiID = $scope.r['poiID'];

            // console.log($scope.rev);

            let req = {
                method: "POST",
                url: "http://localhost:3000/Analysis/addReview",
                headers: {
                    "Content-Type": "application/json"
                    , "x-auth-token": $scope.userData['token']
                },
                data: $scope.rev
            };


            $http(req)
                .then((res) => {
                    // console.log(res);
                    // console.log(res.data);
                    $window.location.href = "#!/poiview"
                }).catch((err) => {
                console.log(err);

            });

        }

    });