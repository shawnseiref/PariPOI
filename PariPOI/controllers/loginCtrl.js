angular
    .module("ourapp")
    .controller("loginCtrl", function ($scope, $http, $window) {
        $scope.submit = function (event) {
            $scope.credentials = {
                "username": $scope.username,
                "password": $scope.password
            };

            // console.log($scope.credentials);

            let loginReq = {
                method: "POST",
                url: "http://localhost:3000/Authentication/login",
                data: $scope.credentials
            };
            $http(loginReq)
                .then((Response) => {
                    let userData = {
                        username: $scope.username,
                        token: Response.data['token']
                    };

                    // console.log(userData);
                    localStorage.setItem("userData", JSON.stringify(userData));
                    $scope.loggedIn = true;
                    $window.location.href = "/index.html";

                })
                .catch((error) => {
                    console.log(error);
                });
        };



    });
