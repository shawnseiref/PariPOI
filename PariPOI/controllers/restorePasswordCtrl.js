angular
    .module("ourapp")
    .controller("restorePasswordCtrl", function ($scope, $http, $window) {
        $scope.questionsShown = false;
        $scope.getQuestions = function (event) {
            $scope.questionsShown = true;
            let req = {
                method: "GET",
                url: "http://localhost:3000/Authentication/ParametersForRegistration",
                headers: {
                    "Content-Type": "application/jason"
                }
            };
            $http(req)
                .then((res) => {
                    // console.log(res.data);
                    $scope.questions = res.data['questions'];
                }).catch((err) => {
                console.log(err);
            });
        };

        $scope.retrievePassword = function (event) {
            var getPassword = {
                method: "POST",
                url: "http://localhost:3000/Authentication/PasswordRetrieval",
                data: {
                    username: $scope.username,
                    answer1: $scope.answer1,
                    answer2: $scope.answer2
                }
            };
            $http(getPassword)
                .then((Response) => {
                    alert("your Password is: " + Response.data['password']);
                    $window.location.href = "#!/login";

                })
                .catch((error) => {
                    if (error.status === 403) {
                        alert(error.data['message']);
                    }
                    console.log(error);
                });
        };
    });
