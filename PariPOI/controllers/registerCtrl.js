app.controller("registerCtrl", function ($scope, $http, $window) {



    $scope.register = function (event) {
        const req = {
            method: "POST",
            url: "http://localhost:3000/Authentication/register",
            data: {
                username: $scope.username,
                password: $scope.password,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                city: $scope.city,
                country: $scope.country,
                email: $scope.email,
                question1: $scope.Q1,
                question2: $scope.Q2,
                answer1: $scope.A1,
                answer2: $scope.A2,
                categories: []
            }
        };
        for (let i = 0; i < $scope.categorySelection.length; i++) {
            req.data.categories.push({categoryName: $scope.categorySelection[i]});
        }
        // console.log(JSON.stringify(req));
        if (req.data.categories.length < 2) {
            alert("please select at least 2 categories!");
        } else if ($scope.Q1 === "" || $scope.Q2 === "" || $scope.country === "") {
            alert("please select all values");
        } else if ($scope.Q1 === $scope.Q2) {
            alert("please select two different questions!");
        } else {
            // console.log(req);
            $http(req)
                .then((res) => {
                    // console.log(res.data);
                    $window.location.href = "#!/login";
                })
                .catch((err) => {
                    console.log(err);
                })
        }


    };

});