angular
    .module("ourapp")
    .controller("favoritesCtrl", function ($scope, $http, $window) {
        $scope.rlike = {};
        $scope.fav2show = [];

        // $window.location.reload();

        let getAllPOIsReq = {
            method: "GET",
            url: "http://localhost:3000/else/getAllPOIs"
        };
        $http(getAllPOIsReq)
            .then((res) => {
                $scope.allPois = res.data['POIs'];
                for (let i = 0; i < $scope.localFav.length; i++) {
                    // let name = $scope.localFav[i]['name'];
                    let id = $scope.localFav[i]['poiID'];
                    let req = {
                        mthod: "GET",
                        url: "http://localhost:3000/else/getPOIbyID/" + id,
                        headers: {
                            "Content-Type": "application/jason"
                        }
                    };
                    $http(req)
                        .then((res) => {
                            res.data['POI']['position'] = $scope.fav2show.length;
                            $scope.fav2show.push(res.data['POI']);
                            // console.log("favs: " + JSON.stringify($scope.fav2show));
                        }).catch((err) => {
                        console.log(err);
                    });
                }

                // let newOrder = [];
                // for (let i = 0; i < $scope.localFav.length; i++) {
                //     newOrder.push($scope.allPois.find(p => p['name'] === $scope.localFav[i])['poiID']);
                // }
                // console.log("newOrder: " + newOrder);
                // $scope.fav2show.sort(((a, b) => a['position']>b['position']?1:-1));
                // console.log("newOrder: " + newOrder);
            }).catch((err) => {
            console.log(err);
        });


        $scope.addFav = function (event) {
            const req = {
                method: "POST",
                url: "http://localhost:3000/Analysis/addFavoritePOI",
                data: {
                    POIName: $scope.newFavName
                },
                headers: {
                    "x-auth-token": $scope.userData["token"],
                    "Content-Type": "application/json"
                }
            };
            // console.log(req);

            $http(req)
                .then((res) => {
                    $window.location.reload();
                    // console.log(res.data);
                    $scope.fav2show.sort(((a, b) => a['position'] > b['position'] ? 1 : -1))
                })
                .catch((err) => {
                    console.log(err);
                })
        };


        $scope.saveFavorites = function (event) {
            for (let i = 0; i < $scope.localFav.length; i++) {
                let p = $scope.localFav[i]['name'];
                // console.log("lcl p: " + p);
                // console.log("dbfav: " + JSON.stringify($scope.dbFav));
                // console.log("stor: " + JSON.stringify(localStorage.getItem("dbFav")));
                let poi = $scope.dbFav.find(poi => poi['name'] === p);
                // console.log("db p: " + poi);
                if (!poi) {
                    p = $scope.allPois.find(poi => poi['name'] === p);
                    let req = {
                        method: "POST",
                        url: "http://localhost:3000/Analysis/addFavoritePOI",
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": $scope.userData["token"]
                        },
                        data: {poiID: p['poiID']}
                    };
                    $http(req)
                        .then((res) => {
                            console.log(res.data);
                            $scope.dbFav.push(p);
                            localStorage.setItem("localFav", JSON.stringify($scope.localFav));
                            $scope.localFav.push(p);
                            localStorage.setItem("dbFav", JSON.stringify($scope.dbFav));
                        }).catch((err) => {
                        // console.log(err);
                    });
                }
            }
            for (let i = 0; i < $scope.dbFav.length; i++) {
                const p = $scope.dbFav[i];
                let poi = $scope.localFav.find(poi => poi === p['name']);
                if (!poi) {
                    poi = $scope.dbFav.find(poi => poi['name'] === p['name']);
                    let req = {
                        method: "DELETE",
                        url: "http://localhost:3000/Analysis/deleteFavoritePOI",
                        headers: {
                            "Content-Type": "application/json"
                            , "x-auth-token": $scope.userData['token']
                        }
                        , data: {poiID: poi['poiID']}
                    };
                    $http(req)
                        .then((res) => {
                            // console.log(res);
                            // console.log(res.data);
                            $scope.localFav.splice($scope.localFav.indexOf(poi['name']), 1);
                            // console.log($scope.localFav);
                            $scope.dbFav.splice($scope.dbFav.indexOf(poi), 1);
                            // console.log($scope.dbFav);
                            localStorage.setItem("dbFav", JSON.stringify($scope.dbFav));

                        }).catch((err) => {
                        console.log(err);
                    });
                }
            }
            let newOrder = [];
            for (let i = 0; i < $scope.localFav.length; i++) {
                newOrder.push($scope.allPois.find(p => p['name'] === $scope.localFav[i]['name'])['poiID']);
            }
            let req = {
                method: "PUT",
                url: "http://localhost:3000/Analysis/updateUserOrder",
                headers: {
                    "Content-Type": "application/json"
                    , "x-auth-token": $scope.userData['token']
                }
                , data: {newOrder: newOrder}
            };

            $http(req)
                .then((res) => {
                    // console.log(res);
                    // console.log("db: " + JSON.stringify($scope.dbFav));
                    // console.log("local: " + JSON.stringify($scope.localFav));
                    console.log("newOrder: " + newOrder);
                }).catch((err) => {
                console.log(err);

            });


        };



    });