var app = angular.module("main", ["ngRoute", "ui.bootstrap", "ngAnimate", "ngTouch"]);

// controllers
app.controller('CarouselController', function ($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    function initSlides() {
        //get logics

        slides.push({
            image: 'https://i.ytimg.com/vi/ub9JUDS_6i8/maxresdefault.jpg',
            text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
            id: currIndex++
        });

        slides.push({
            image: 'http://media-www-battlefieldwebcore.spark.ea.com/content/battlefield-portal/ru_RU/_global_/_jcr_content/ccm/componentwrapper_3/components/opengraph/ogImage.img.jpg',
            text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
            id: currIndex++
        });
    }

    initSlides();

});

app.controller('SideMenuController', function ($scope, SideMenuService) {

    $scope.Items = SideMenuService.Get();
});

app.controller("NavBarController", [
    "$scope", "UserService", "$location", "LoadBarService", function ($scope, UserService, $location, LoadBarService) {

        $scope.isCollapsed = true;

        $scope.isAuthenticated = UserService.IsLogedIn();

        $scope.loadBar = LoadBarService.Get();

        $scope.User = UserService.GetUser();

        $scope.logOff = function () {
            UserService.LogOff();
            $location.path("/");
        }


    }
]);


app.controller("IndexController", [
    "$scope", "$http", "SideMenuService", function ($scope, $http, SideMenuService) {

    }
]);


app.controller("LoginController", [
    "$scope", "UserService", "$location", function ($scope, UserService, $location) {

        $scope.Login = "";

        $scope.Password = "";

        $scope.errors = [];

        $scope.login = function () {
            $scope.errors = [];
            if (!$scope.Login)
                $scope.errors.push("Поле \"Логин\" не заполнено!");
            if (!$scope.Password)
                $scope.errors.push("Поле \"Пароль\" не заполнено!");

            if ($scope.errors.length !== 0)
                return;

            UserService.Login($scope.Login, $scope.Password).then(function (val) {
                if (val === true)
                    $location.path("/");
                else
                    $scope.errors = ["Wrong login or password!"];
            });
        };
    }
]);

app.controller("RegistrationController", [
    "$scope", "UserService", "$location", function ($scope, UserService, $location) {


        $scope.Login = "";

        $scope.Password = "";

        $scope.SecPassword = "";

        $scope.errors = [];

        $scope.registrate = function () {
            $scope.errors = [];
            if (!$scope.Login)
                $scope.errors.push("Поле \"Логин\" не заполнено!");
            else if ($scope.Login.length < 4)
                $scope.errors.push("Логин короче 4 символов!");

            if (!$scope.Password)
                $scope.errors.push("Поле \"Пароль\" не заполнено!");
            else if ($scope.Password.length < 4)
                $scope.errors.push("Пароль короче 4 символов!");


            if ($scope.Login.length > 16)
                $scope.errors.push("Логин длиннее 16 символов!");
            if ($scope.Password.length > 16)
                $scope.errors.push("Пароль длиннее 16 символов!");




            if ($scope.Password !== $scope.SecPassword)
                $scope.errors.push("Пароли не совпадают");

            if ($scope.errors.length !== 0)
                return;

            UserService.Registrate($scope.Login, $scope.Password).then(function (val) {
                if (val === true)
                    $location.path("/Home/Login");
                else
                    $scope.errors = ["Login is already in use!"];
            });

        };
    }
]);


app.controller("GenresController", [
    "$scope", "$http", "GenreService", "LoadBarService", function ($scope, $http, GenreService, LoadBarService) {
        LoadBarService.Show();
        var prom = GenreService.GetAll();

        prom.then(function (value) {
            $scope.Genres = value.sort(function (a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });
            LoadBarService.Hide();
        });

        $scope.Genres = [];
    }
]);
app.controller("AddGenreController", [
    "$scope", "$http", "$location", "GenreService", function ($scope, $http, $location, GenreService) {
        $scope.Name = "";

        $scope.Desc = "";

        $scope.errors = [];

        $scope.Add = function () {
            $scope.errors = [];
            $scope.errors = [];
            if (!$scope.Name)
                $scope.errors.push("Поле \"Название\" не заполнено!");
            else if ($scope.Name.length < 4)
                $scope.errors.push("Название короче 4 символов!");

            if ($scope.Name.length > 16)
                $scope.errors.push("Название длиннее 16 символов!");
            if ($scope.Desc.length > 400)
                $scope.errors.push("Описание длиннее 200 символов!");

            if ($scope.errors.length !== 0)
                return;

            GenreService.Add($scope.Name, $scope.Desc);

            $location.path("/Genres");
        };
    }
]);
app.controller("DeleteGenreController", [
    "$scope", "$http", "GenreService", "$routeParams", "$location", "LoadBarService",
    function ($scope, $http, GenreService, $routeParams, $location, LoadBarService) {
        LoadBarService.Show();
        if (!$routeParams.id || $routeParams.id < 1) {
            $location.path("/Genres");
        }
        var prom = GenreService.Get($routeParams.id);

        prom.then(function (value) {
            $scope.genre = value;
            LoadBarService.Hide();
        });

        $scope.genre = {};

        $scope.Cancel = function () {
            $location.path("/Genres");
        }

        $scope.Delete = function () {
            if (LoadBarService.Get().show)
                return;
            GenreService.Delete($routeParams.id);
            $location.path("/Genres");
        }
    }
]);
app.controller("EditGenreController", [
    "$scope", "$http", "GenreService", "$routeParams", "$location", "LoadBarService",
    function ($scope, $http, GenreService, $routeParams, $location, LoadBarService) {
        LoadBarService.Show();
        if (!$routeParams.id || $routeParams.id < 1) {
            $location.path("/Genres");
        }
        var prom = GenreService.Get($routeParams.id);

        prom.then(function (value) {
            $scope.genre = value;
            LoadBarService.Hide();
        });

        $scope.errors = [];

        $scope.genre = { name: "", genreDescription: "" };

        $scope.Cancel = function () {
            $location.path("/Genres");
        }

        $scope.Edit = function () {
            if (LoadBarService.Get().show)
                return;
            GenreService.Edit({
                Id: $scope.genre.id,
                Name: $scope.genre.name,
                Description: $scope.genre.genreDescription
            });
            $location.path("/Genres");
        }
    }
]);


app.controller("CompaniesController", [
    "$scope", "$http", "CompanyService", "LoadBarService", function ($scope, $http, CompanyService, LoadBarService) {
        LoadBarService.Show();
        var prom = CompanyService.GetAll();

        prom.then(function (value) {
            if (value.length)
                $scope.Companies = value.sort(function (a, b) {
                    return a.companyName.toLowerCase().localeCompare(b.companyName.toLowerCase());
                });
            LoadBarService.Hide();
        });

        $scope.Companies = [];
    }
]);
app.controller("AddCompanyController", [
    "$scope", "$http", "$location", "LoadBarService", "CountryService",
    function ($scope, $http, $location, LoadBarService, CountryService) {
        LoadBarService.Show();

        var prom = CountryService.GetAll();

        prom.then(function (value) {
            $scope.Countries = value;

            if ($scope.Countries.length === 0) {
                $scope.Countries = [{
                    id: -1,
                    Name: "Стран не найдено"
                }];
            }

            $scope.Country = $scope.Countries[0].id;
            LoadBarService.Hide();
        });


        var imgPicked = false;

        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                $scope.file = file.name;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        };
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.img = e.target.result;
                imgPicked = true;
            });
        };
        $scope.ResetImage = function () {
            $scope.img = "/Content/Images/Technical/noimagefound.jpg";
            imgPicked = false;
        }

        $scope.img = "/Content/Images/Technical/noimagefound.jpg";

        $scope.Name = "";

        $scope.file = "";

        $scope.Desc = "";

        $scope.Country = {};

        $scope.Countries = {};

        $scope.errors = [];


        $scope.AddCompany = function () {
            if (LoadBarService.Get().show)
                return;
            $scope.errors = [];

            if (!$scope.Name)
                $scope.errors.push("Поле \"Название\" не заполнено!");
            else if ($scope.Name.length < 4)
                $scope.errors.push("Название короче 4 символов!");

            if ($scope.Name.length > 16)
                $scope.errors.push("Название длиннее 16 символов!");
            if ($scope.Desc.length > 300)
                $scope.errors.push("Описание длиннее 300 символов!");

            if ($scope.errors.length !== 0)
                return;

            LoadBarService.Show();

            var company = {
                "Name": $scope.Name,
                "Description": $scope.Desc,
                "Country.Id": $scope.Country

            };

            $http({
                url: "Data/Company/Add",
                method: "Post",
                params: company,
                data: imgPicked ? $scope.img : "",
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            }).then(function (val) {
                LoadBarService.Hide();
                $location.path("/Companies");
            });


        };
    }
]);
app.controller("DeleteCompanyController", [
    "$scope", "$http", "CompanyService", "$routeParams", "$location", "LoadBarService",
    function ($scope, $http, CompanyService, $routeParams, $location, LoadBarService) {
        LoadBarService.Show();
        if (!$routeParams.id || $routeParams.id < 1) {
            $location.path("/Companies");
        }
        var prom = CompanyService.Get($routeParams.id);

        prom.then(function (value) {
            $scope.model = value;
            LoadBarService.Hide();

            if (!$scope.model.id) {
                $location.path("/Companies");
            }
        });

        $scope.model = {};

        $scope.Cancel = function () {
            $location.path("/Companies");
        }

        $scope.Delete = function () {
            if (LoadBarService.Get().show)
                return;

            var model = {
                Id: $scope.model.id,
                ImageUrl: $scope.model.url
            }
            CompanyService.Delete(model);
            $location.path("/Companies");
        }
    }
]);
app.controller("EditCompanyController", [
    "$scope", "$http", "$location", "LoadBarService", "CountryService", "$routeParams", "CompanyService",
    function ($scope, $http, $location, LoadBarService, CountryService, $routeParams, CompanyService) {
        if (!$routeParams.id || $routeParams.id < 1) {
            $location.path("/Companies");
        }
        LoadBarService.Show();

        var promCountries = CountryService.GetAll();

        promCountries.then(function (value) {
            $scope.Countries = value;

            if ($scope.Countries.length === 0) {
                $scope.Countries = [{
                    id: -1,
                    Name: "Стран не найдено"
                }];
            }

            //if (model)
            //    $scope.Country = $scope.model.country.id;

            LoadBarService.Hide();
        });


        var prom = CompanyService.Get($routeParams.id);

        prom.then(function (value) {

            $scope.model = value;
            $scope.img = value.url;
            LoadBarService.Hide();

            if (!$scope.model.id) {
                $location.path("/Companies");
            }
        });


        var imgPicked = false;

        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                $scope.file = file.name;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        };
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.img = e.target.result;
                imgPicked = true;
            });
        };
        $scope.ResetImage = function () {
            $scope.img = $scope.model.url;
            $scope.file = "";
            imgPicked = false;
        }

        $scope.model = {};

        $scope.img = "";

        $scope.Countries = {};

        $scope.errors = [];

        $scope.Cancel = function () {
            $location.path("/Companies");
        }

        $scope.EditCompany = function () {
            if (LoadBarService.Get().show)
                return;
            $scope.errors = [];

            if (!$scope.model.companyName)
                $scope.errors.push("Поле \"Название\" не заполнено!");
            else if ($scope.model.companyName.length < 4)
                $scope.errors.push("Название короче 4 символов!");

            if ($scope.model.companyName.length > 16)
                $scope.errors.push("Название длиннее 16 символов!");
            if ($scope.model.companyDescription)
                if ($scope.model.companyDescription.length > 300)
                    $scope.errors.push("Описание длиннее 300 символов!");

            if ($scope.errors.length !== 0)
                return;

            LoadBarService.Show();

            var company = {
                "Id": $scope.model.id,
                "Name": $scope.model.companyName,
                "Description": $scope.model.companyDescription,
                "Country.Id": $scope.model.country.id,
                "ImageUrl": $scope.model.url
            };

            $http({
                url: "Data/Company/Edit",
                method: "Post",
                params: company,
                data: imgPicked ? $scope.img : "",
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            }).then(function (val) {
                LoadBarService.Hide();
                $location.path("/Companies");
            });


        };
    }
]);


app.controller("AddGameController", [
    "$scope", "$http", "$location", "LoadBarService", "GameService", "CompanyService", "GenreService",
    function ($scope, $http, $location, LoadBarService, GameService, CompanyService, GenreService) {
        $scope.model = {
            Name: "",
            Description: "",
            Company: {
                Id: 0,
            },
            Age: 0,
            Requirements: "ОС: \n" +
                "Процессор: \n" +
                "Оперативная память: \n" +
                "Видеокарта: \n" +
                "DirectX: \n" +
                "Место на диске: ",
            Price: 0
        };

        LoadBarService.Show();
        var load = [1, 1];

        var promCompanies = CompanyService.GetAll();
        promCompanies.then(function (value) {
            $scope.Companies = value.sort(function (a, b) {
                return a.companyName.toLowerCase().localeCompare(b.companyName.toLowerCase());
            });

            if ($scope.Companies.length === 0) {
                $scope.Companies = [{
                    id: -1,
                    Name: "Компаний не найдено"
                }];
            }

            $scope.model.Company.Id = $scope.Companies[0].id;
            popLoad();
        });

        var promGenres = GenreService.GetAll();
        promGenres.then(function (value) {
            $scope.Genres = value.sort(function (a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });

            if ($scope.Genres.length === 0) {
                $scope.Genres = [{
                    id: -1,
                    Name: "Жанров не найдено"
                }];
            }
            $scope.genre = $scope.Genres[0].id;
            popLoad();
        });

        function popLoad() {
            load.pop();

            if (load.length === 0)
                LoadBarService.Hide();
        }

        var imgPicked = false;

        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                $scope.file = file.name;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        };
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.img = e.target.result;
                imgPicked = true;
            });
        };
        $scope.ResetImage = function () {
            $scope.img = "/Content/Images/Technical/noimagefound.jpg";
            imgPicked = false;
            $scope.file = "";
        }

        $scope.img = "/Content/Images/Technical/noimagefound.jpg";

        $scope.file = "";

        $scope.Companies = {};

        $scope.chosenGenres = [];

        $scope.Genres = [];

        $scope.errors = [];


        $scope.AddGame = function () {
            if (LoadBarService.Get().show)
                return;
            $scope.errors = [];


            if (!$scope.model.Name)
                $scope.errors.push("Поле \"Название\" не заполнено!");
            else if ($scope.model.Name.length < 4)
                $scope.errors.push("Название короче 4 символов!");

            if ($scope.model.Name.length > 16)
                $scope.errors.push("Название длиннее 16 символов!");
            if ($scope.model.Name.Description > 300)
                $scope.errors.push("Описание длиннее 300 символов!");

            if (!$scope.model.DateOut)
                $scope.errors.push("Не указана Дата Выхода!");

            if (!imgPicked)
                $scope.errors.push("Не выбрано изображение!");

            if ($scope.errors.length !== 0)
                return;

            LoadBarService.Show();

            var cGen = [];

            $scope.chosenGenres.forEach(function (item, i, arr) {
                cGen.push({
                    "Id": item
                });
            });

            var model = {
                "Name": $scope.model.Name,
                "Description": $scope.model.Description,
                "DateOut": $scope.model.DateOut,
                "Company.Id": $scope.model.Company.Id,
                "Price": $scope.model.Price,
                "Age": $scope.model.Age,
                "Genres": JSON.stringify(cGen),
                "Requirements": $scope.model.Requirements
            }

            $http({
                url: "Data/Game/Add",
                method: "Post",
                params: model,
                data: imgPicked ? $scope.img : "",
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                }
            }).then(function (val) {
                LoadBarService.Hide();
                $location.path("/Shop");
            });


        };
    }
]);
// services
app.service("SideMenuService", function () {
    var items = [
        {
            name: 'Главная',
            checked: false,
            url: "/"
        },
        {
            name: 'Магазин',
            checked: false,
            url: "/Shop"
        },
        {
            name: 'Библиотека',
            checked: false,
            url: "/Library"
        },
        {
            name: "Корзина",
            checked: false,
            url: "/Cart",
            icon: "glyphicon glyphicon-shopping-cart"
        },
        {
            name: "Separator"
        },
        {
            name: "Жанры",
            checked: false,
            url: "/Genres"
        },
        {
            name: "Компании",
            checked: false,
            url: "/Companies"
        },
    ];

    function Reset() {
        items.forEach(function (it, i, arr) {
            it.checked = false;
        });
    }

    return {
        Check: function (url) {
            Reset();

            items.forEach(function (it, i, arr) {
                if (it.url === url)
                    it.checked = true;
            });
        },
        Get: function () {
            return items;
        }
    };
});

app.service("UserService", ["$http", "$q",
    function ($http, $q) {
        var user = {};
        InitUser();

        var logedIn = {};

        function ClearUser() {
            user.login = "";

            user.id = -1;

            user.role = -1;
        }

        function InitUser() {
            user.login = sessionStorage.getItem("userLogin");
            user.id = sessionStorage.getItem("userId");
        }

        return {
            Login: function (lg, pas) {
                var def = $q.defer();
                var user = {
                    "Login": lg,
                    "Password": pas
                };

                $http({
                    url: "/User/Login",
                    method: "Post",
                    data: JSON.stringify(user)
                }).then(function (val) {

                    if (val.data !== -1) {
                        logedIn.Value = true;
                        //user.login = lg;
                        //user.password = pas;
                        //user.id = val.data.Id;
                        //user.role = val.data.Role;

                        //localStorage.setItem("login", user.login);
                        //localStorage.setItem("pas", user.password);
                        //localStorage.setItem("userId", user.id);
                        //localStorage.setItem("role", user.role);

                        def.resolve(true);
                    }


                    def.resolve(false);
                });


                return def.promise;
            },
            Registrate: function (lg, pas) {
                var def = $q.defer();
                var user = {
                    "Login": lg,
                    "Password": pas
                };
                $http({
                    url: "/User/Create",
                    method: "POST",
                    data: JSON.stringify(user)
                }).then(function (val) {

                    if (val.data !== 0) {
                        def.resolve(false);
                    }

                    def.resolve(true);
                });


                return def.promise;
            },
            LogOff: function () {
                //localStorage.setItem("login", "");
                //localStorage.setItem("pas", "");
                //localStorage.setItem("userId", "");
                //localStorage.setItem("role", -1);
                logedIn.Value = false;

                ClearUser();

                $http({
                    url: "/User/LogOff",
                    method: "Post"
                });
            },
            IsLogedIn: function () {
                if (logedIn.Value)
                    return logedIn;
                else {
                    if (!sessionStorage.getItem("userId")) {
                        logedIn.Value = false;
                    } else {
                        logedIn.Value = true;
                    }

                    return logedIn;
                }
            },
            GetUser: function () {
                InitUser();
                return user;
            }
        };
    }
]);

app.service("GenreService", ["$http", "$q",
    function ($http, $q) {

        return {
            Add: function (name, desc) {

                var genre = {
                    "Name": name,
                    "Description": desc
                };

                $http({
                    url: "Data/Genre/Add",
                    method: "Post",
                    data: JSON.stringify(genre)
                }).then(function (val) {



                });

            },
            GetAll: function () {
                var def = $q.defer();

                $http({
                    url: "Data/Genre/GetAll",
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },
            Get: function (id) {
                var def = $q.defer();

                $http({
                    url: "Data/Genre/Get",
                    data: { id: id },
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);

                });

                return def.promise;
            },
            Delete: function (id) {
                var def = $q.defer();

                $http({
                    url: "Data/Genre/Delete",
                    data: { id: id },
                    method: "Post",
                }).then(function (val) {

                    var _data = val.data;
                    def.resolve(_data);

                });

                return def.promise;
            },
            Edit: function (model) {


                $http({
                    url: "Data/Genre/Edit",
                    data: JSON.stringify(model),
                    method: "Post",
                });
            }
        };
    }
]);

app.service("CountryService", ["$http", "$q",
    function ($http, $q) {

        return {

            GetAll: function () {
                var def = $q.defer();

                $http({
                    url: "Data/Country/GetAll",
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },

        };
    }
]);

app.service("CompanyService", ["$http", "$q",
    function ($http, $q) {

        return {

            GetAll: function () {
                var def = $q.defer();

                $http({
                    url: "Data/Company/GetAll",
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },
            Get: function (id) {
                var def = $q.defer();

                $http({
                    url: "Data/Company/Get",
                    data: { id: id },
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);

                });

                return def.promise;
            },
            Delete: function (model) {
                var def = $q.defer();

                $http({
                    url: "Data/Company/Delete",
                    data: JSON.stringify(model),
                    method: "Post",
                }).then(function (val) {

                    var _data = val.data;
                    def.resolve(_data);

                });

                return def.promise;
            },
            Edit: function (model) {


                $http({
                    url: "Company/Genre/Edit",
                    data: JSON.stringify(model),
                    method: "Post",
                });
            }
        };
    }
]);

app.service("GameService", ["$http", "$q",
    function ($http, $q) {

        return {

            GetAll: function () {
                var def = $q.defer();

                $http({
                    url: "Data/Game/GetAll",
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },
            Get: function (id) {
                var def = $q.defer();

                $http({
                    url: "Data/Game/Get",
                    data: { id: id },
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);

                });

                return def.promise;
            },
            Delete: function (model) {
                var def = $q.defer();

                $http({
                    url: "Data/Game/Delete",
                    data: JSON.stringify(model),
                    method: "Post",
                }).then(function (val) {

                    var _data = val.data;
                    def.resolve(_data);

                });

                return def.promise;
            },
            Edit: function (model) {

                $http({
                    url: "Company/Game/Edit",
                    data: JSON.stringify(model),
                    method: "Post",
                });
            }
        };
    }
]);

app.service("LoadBarService", function () {
    var bar = { show: false };

    return {

        Get: function () {
            return bar;
        },
        Show: function () {
            bar.show = true;
        },
        Hide: function () {
            bar.show = false;
        }
    };
});

// directives
app.directive('resizer', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if ($window.innerWidth > attrs.winSize)
                elem.addClass(attrs.resizer);
            else elem.removeClass(attrs.resizer);

            angular.element($window).on('resize', function () {
                if ($window.innerWidth > attrs.winSize)
                    elem.addClass(attrs.resizer);
                else elem.removeClass(attrs.resizer);
            });
        }
    }
}]);

// listeners
app.run(['$rootScope', '$route', 'SideMenuService', '$location', function ($rootScope, $route, SideMenuService, $location) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;

        var url = $location.path();
        SideMenuService.Check(url);
    });
}]);

//routing
app.config([
    "$locationProvider", "$routeProvider",
    function ($locationProvider, $routeProvider) {
        $routeProvider
            .when("/",
            {
                templateUrl: "html/Index.html",
                controller: "IndexController",
                title: 'GameStore'
            })
            .when("/Home/Layout/",
            {
                templateUrl: "Views/Angular/Index.html",
                controller: "IndexController",
                title: 'GameStore'
            })

            .when("/Login",
            {
                templateUrl: "html/User/Login.html",
                controller: "LoginController",
                title: 'Войти'
            })
            .when("/Registration",
            {
                templateUrl: "html/User/Registration.html",
                controller: "RegistrationController",
                title: 'Регистрация'
            })

            .when("/Genres",
            {
                templateUrl: "html/Genre/AllGenres.html",
                controller: "GenresController",
                title: 'Жанры'
            })
            .when("/Genre/Add",
            {
                templateUrl: "html/Genre/AddGenre.html",
                controller: "AddGenreController",
                title: 'Добавить жанр'
            })
            .when("/Genre/Delete/:id",
            {
                templateUrl: "html/Genre/DeleteGenre.html",
                controller: "DeleteGenreController",
                title: 'Удалить жанр'
            })
            .when("/Genre/Edit/:id",
            {
                templateUrl: "html/Genre/EditGenre.html",
                controller: "EditGenreController",
                title: 'Редактировать жанр'
            })

            .when("/Companies",
            {
                templateUrl: "html/Company/AllCompanies.html",
                controller: "CompaniesController",
                title: 'Компании'
            })
            .when("/Company/Add",
            {
                templateUrl: "html/Company/AddCompany.html",
                controller: "AddCompanyController",
                title: 'Добавить компанию'
            })
            .when("/Company/Delete/:id",
            {
                templateUrl: "html/Company/DeleteCompany.html",
                controller: "DeleteCompanyController",
                title: 'Удалить компанию'
            })
            .when("/Company/Edit/:id",
            {
                templateUrl: "html/Company/EditCompany.html",
                controller: "EditCompanyController",
                title: 'Редактировать компанию'
            })

            .when("/Games",
            {
                templateUrl: "html/Company/AllCompanies.html",
                controller: "CompaniesController",
                title: 'Компании'
            })
            .when("/Game/Add",
            {
                templateUrl: "html/Game/AddGame.html",
                controller: "AddGameController",
                title: 'Добавить игру'
            })
            .when("/Game/Delete/:id",
            {
                templateUrl: "html/Company/DeleteCompany.html",
                controller: "DeleteCompanyController",
                title: 'Удалить компанию'
            })
            .when("/Game/Edit/:id",
            {
                templateUrl: "html/Company/EditCompany.html",
                controller: "EditCompanyController",
                title: 'Редактировать компанию'
            })

            .otherwise({ redirectTo: "/" });

        $locationProvider.html5Mode(true);
    }
]);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

// staff

app.controller("AddImageController", [
    "$scope", "$http", "$location", "ImageService", "Page", "UserService", function ($scope, $http, $location, ImageService, Page, UserService) {
        $scope.imageUpload = function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {

                var file = files[i];

                $scope.file = file.name;
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        };
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.img = e.target.result;
                imgPicked = true;
            });
        };
        $http({
            url: "/Data/GetAlbums",
            method: "Get"
        }).then(function (resp) {
            $scope.albums = resp.data;

            if ($scope.albums.length == 0) {
                $scope.albums = [{
                    Id: -1,
                    Name: "No albums found"
                }];
            }

            $scope.album = $scope.albums[0].Id;
        });


        $scope.img = "../../../Content/Images/Technical/noimagefound.jpg";

        $scope.name = "";

        $scope.file = "";

        $scope.description = "";

        $scope.album = {};

        $scope.albums = [];

        $scope.errors = [];

        var imgPicked = false;

        $scope.AddImage = function () {
            if (!UserService.IsLogedIn().Value) {
                $location.path("/Home/Login");
                return;
            }

            $scope.errors = [];

            if (!$scope.name)
                $scope.errors.push("Name field is required!");
            if ($scope.name.length > 16)
                $scope.errors.push("Name is longer then 16!");
            if ($scope.description.length > 500)
                $scope.errors.push("Description is longer then 16!");
            if (!imgPicked)
                $scope.errors.push("You need to peak an image!");
            if ($scope.album == -1)
                $scope.errors.push("You need to peak an album!");

            if ($scope.errors.length !== 0)
                return;

            ImageService.Add($scope.name,
                $scope.description,
                $scope.album,
                $scope.img,
                function () {

                    $location.path("/Home/Album/" + $scope.album);
                });


        };
    }
]);

app.controller("ImagesController", [
        "$scope", "$http", "$routeParams", "ImageService", "Page", "UserService", "$location",
        function ($scope, $http, $routeParams, ImageService, Page, UserService, $location) {

            var prom = ImageService.GetAll($routeParams.id);

            prom.then(function (value) {
                $scope.images = value;
                $scope.loaded = true;

                InitExtensions();

                CheckCart();
            });

            $scope.images = {};
            $scope.imgView = false;

            $scope.allImgMode = $routeParams.id === "all";

            $scope.img = {};

            $scope.loaded = false;

            $scope.User = UserService.GetUser();

            $scope.exts = [];

            function InitExtensions() {
                $scope.exts = [];
                for (var i = 0; i < $scope.images.length; i++) {
                    if ($scope.exts.filter(function (val) { return val.name === $scope.images[i].Ext }) == 0)
                        $scope.exts.push({
                            name: $scope.images[i].Ext,
                            checked: true
                        });
                }
            }

            function CheckCart() {
                var cart = localStorage.getItem("cart");
                if (!cart) {
                    cart = [];
                } else {
                    cart = JSON.parse(cart);
                }

                for (var i = 0; i < $scope.images.length; i++) {
                    for (var j = 0; j < cart.length; j++) {
                        if ($scope.images[i].Id == cart[j])
                            $scope.images[i].isInCart = true;
                    }
                }

            }

            $scope.filterExt = function () {
                $scope.images = ImageService.Get();
                $scope.images = $scope.images.filter(function (val) {
                    for (var i = 0; i < $scope.exts.length; i++) {
                        if (!$scope.exts[i].checked)
                            continue;
                        if ($scope.exts[i].name === val.Ext)
                            return true;
                    }
                    return false;
                });
            }
            $scope.viewImg = function (img) {
                $scope.imgView = true;
                $scope.img = img;
            };
            $scope.closeViewImg = function () {
                $scope.imgView = false;
                $scope.img = null;


            };
            $scope.NextImg = function () {
                $scope.img = ImageService.NextImg($scope.img, $scope.images);
            };
            $scope.PrevImg = function () {
                $scope.img = ImageService.PrevImg($scope.img, $scope.images);
            };
            $scope.DeleteAlbum = function () {
                $http({
                    url: "/Data/DeleteAlbum",
                    method: "Get",

                    params: {
                        "idt": $routeParams.id
                    }
                }).then(function () {
                    $location.path("/Home/Albums");
                });
            }
            $scope.DeleteImg = function () {

                ImageService.Remove($scope.img);
                $scope.closeViewImg();
                $scope.images = ImageService.Get();
                InitExtensions();
                $scope.filterExt();
            }
            $scope.AddToCart = function () {

                var cart = localStorage.getItem("cart");
                if (!cart) {
                    cart = [];
                } else {
                    cart = JSON.parse(cart);
                }

                cart.push($scope.img.Id);

                localStorage.setItem("cart", JSON.stringify(cart));

                $scope.img.isInCart = true;
            }
            $scope.getSelectedRating = function (rate) {
                alert(rate);
            }
        }
]);



app.controller("CartController", [
        "$scope", "$http", "$routeParams", "ImageService", "Page", "UserService", "$location",
        function ($scope, $http, $routeParams, ImageService, Page, UserService, $location) {

            var prom = ImageService.GetAll("all");

            prom.then(function (value) {
                $scope.images = value;
                $scope.loaded = true;

                initCart();
            });


            $scope.images = {};

            $scope.loaded = false;

            $scope.User = UserService.GetUser();

            function initCart() {
                var cart = localStorage.getItem("cart");
                if (!cart) {
                    $scope.images = [];
                } else {
                    cart = JSON.parse(cart);

                    $scope.images = $scope.images.filter(function (val) {
                        for (var i = 0; i < cart.length; i++) {
                            if (val.Id == cart[i])
                                return true;
                        }
                        return false;
                    });
                }
            }

            $scope.RemoveFromCart = function (id) {
                var cart = localStorage.getItem("cart");

                cart = JSON.parse(cart);

                cart.splice(cart.indexOf(id), 1);

                localStorage.setItem("cart", JSON.stringify(cart));

                initCart();
            }
        }
]);



app.controller("AddAlbumController", [
    "$scope", "$http", "$location", "Page", "UserService", function ($scope, $http, $location, Page, UserService) {


        $scope.name = "";

        $scope.description = "";

        $scope.errors = [];

        $scope.AddAlbum = function () {
            if (!UserService.IsLogedIn().Value) {
                $location.path("/Home/Login");
                return;
            }

            $scope.errors = [];

            if (!$scope.name)
                $scope.errors.push("Name field is required!");
            if ($scope.name.length > 16)
                $scope.errors.push("Name is longer then 16!");
            if ($scope.description.length > 500)
                $scope.errors.push("Description is longer then 16!");

            if ($scope.errors.length !== 0)
                return;

            $http({
                url: "/Data/AddAlbum",
                method: "Get",

                params: {
                    "name": $scope.name,
                    "desc": $scope.description,
                    "author": UserService.GetUser().id
                }

            }).then(function () {

                $location.path("/Home/Albums");
            });
        };
    }
]);

app.controller("AlbumsController", [
    "$scope", "$http", "$window", "Page", function ($scope, $http, $window, Page) {


        getAlbums();
        $scope.albums = [];

        function getAlbums() {
            $http({
                url: "/Data/GetAlbums",
                method: "Get"
            }).then(function (resp) {
                $scope.albums = resp.data.filter(function (val) {
                    return val.CoverUrl !== "/Content/Images/Technical/noimagefound.jpg";
                });
            });
        }
    }
]);

app.service("ImageService", ["$http", "$q", "UserService",
    function ($http, $q, UserService) {
        var _data;

        var albumId = {};

        return {
            GetAll: function (album) {
                var def = $q.defer();

                albumId = album;


                var ctrl;
                if (albumId === "all") {
                    ctrl = "/Data/GetImages";
                } else {
                    ctrl = "/Data/GetImagesById";
                }
                $http({
                    url: ctrl,
                    method: "Get",
                    params: {
                        "albumId": albumId
                    }
                }).then(function (val) {
                    _data = val.data;
                    def.resolve(_data);
                });



                return def.promise;
            },

            Get: function () {
                return _data;
            },

            Add: function (name, desc, album, img, callback) {

                $http({
                    url: "/Data/AddImage",
                    method: "Post",

                    params: {
                        "name": name,
                        "desc": desc,
                        "albumId": album,
                        "author": UserService.GetUser().id
                    },
                    data: {
                        "imgCode": img
                    },
                    headers: {
                        'Content-Type': "application/x-www-form-urlencoded"
                    }
                }).then(function () {

                    callback();
                });
            },

            NextImg: function (img, imgs) {
                for (var i = 0; i < imgs.length; i++) {
                    if (imgs[i] === img) {
                        if (i !== imgs.length - 1)
                            return imgs[i + 1];
                        else
                            return imgs[0];
                    }
                }
            },

            PrevImg: function (img, imgs) {
                for (var i = imgs.length - 1; i > -1 ; i--) {
                    if (imgs[i] === img) {
                        if (i !== 0)
                            return imgs[i - 1];
                        else
                            return imgs[imgs.length - 1];
                    }
                }
            },

            Remove: function (img) {
                $http({
                    url: "/Data/DeleteImage",
                    method: "Get",

                    params: {
                        "idt": img.Id
                    }
                });

                var index = _data.indexOf(img);

                if (index > -1) {
                    _data.splice(index, 1);
                }
            }
        };
    }]);