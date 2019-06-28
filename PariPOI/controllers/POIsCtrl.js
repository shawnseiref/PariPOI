angular
    .module("ourapp")
    .controller("POIsCtrl", function ($scope, $http, $window) {
        $scope.filteredPois = [];
        $scope.categories = [];
        $scope.filteredPois = $scope.allPois;
        $scope.searchbar = "";

        let reqC = {
            mthod: "GET",
            url: "http://localhost:3000/Authentication/ParametersForRegistration",
            headers: {
                "Content-Type": "application/jason"
            }
        };
        $http(reqC)
            .then((res) => {
                $scope.categories = res.data['categories'];

            }).catch((err) => {
            console.log(err);
        });


        $scope.showByCategory = function (event) {
            let cat = event.target.id;
            if (cat === "All") {
                $scope.filteredPois = $scope.allPois;
                $scope.filteredPois.sort((a, b) => a['poiID'] > b['poiID'] ? 1 : -1);
            } else if (cat === 'rank') {
                $scope.filteredPois.sort((a, b) => a['ranking'] > b['ranking'] ? -1 : 1);
            } else {
                $scope.filteredPois = [];
                let getAllPOIsByCategory = {
                    mthod: "POST",
                    url: "http://localhost:3000/else/getAllPOIsByCategories",
                    headers: {
                        "Content-Type": "application/jason"
                    },
                };
                $http(getAllPOIsByCategory)
                    .then((res) => {
                        for (let i = 0; i < res.data['POIs'].length; i++) {
                            const poi = res.data['POIs'][i];
                            if (poi['categoryName'] === cat) {
                                $scope.filteredPois.push(poi);
                            }
                        }
                    }).catch((err) => {
                    console.log(err);
                });

            }
        };

        $scope.search = function (searchbar) {
            let s = searchbar.split(" ");
            let res = [];
            for (let i = 0; i < s.length; i++) {
                let w = s[i];
                let tmp = $scope.allPois.filter(p => p['name'].toLowerCase().includes(w.toLowerCase()) || p['description'].toLowerCase().includes(w.toLowerCase()));
                for (let j = 0; j < tmp.length; j++) {
                    if (tmp[j]) {
                        res.push(tmp[j]);
                    }
                }
            }

            let set = new Set(res);
            res = [];
            for (const s of set) {
                res.push(s);
            }
            if (res.length > 0) {
                $scope.filteredPois = res;
            } else {
                alert("No Results Found");
                $scope.filteredPois = $scope.allPois;
            }
        }


    });