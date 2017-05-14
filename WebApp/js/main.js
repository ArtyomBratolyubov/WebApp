var app = angular.module("main", ["ngRoute", "ui.bootstrap", "ngAnimate", "ngTouch", "checklist-model", "chart.js"]);

// controllers
app.controller("SideMenuController", function ($scope, SideMenuService) {

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

        $scope.SearchText = "";

        $scope.Search = function () {
            if ($scope.SearchText)
                $location.path("/Search/" + $scope.SearchText);
        }
    }
]);


app.controller("IndexController", [
         "$scope", "$http", "GameService", "LoadBarService",
    function ($scope, $http, GameService, LoadBarService) {
        LoadBarService.Show();
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];

        var prom = GameService.GetAll();
        $scope.Games = [];
        prom.then(function (value) {
            $scope.Games = value;

            initSlides();
            initRatedGames();
            initCommnetedGames();

            LoadBarService.Hide();
        });

        function initSlides() {
            for (var i = $scope.Games.length - 1, j = 0; i >= 0 ; i--, j++) {

                if (j > 4)
                    break;

                var ob = $scope.Games[i];
                ob.num = j;
                slides.push(ob);
            }
        }

        $scope.RatedGames = [];

        function initRatedGames() {
            $scope.RatedGames = $scope.Games.sort(function (a, b) {
                return b.rating - a.rating;
            }).slice(0, 4);
        }

        $scope.CommnetedGames = [];

        function initCommnetedGames() {
            $scope.CommnetedGames = $scope.Games.sort(function (a, b) {
                return b.commentNumber - a.commentNumber;
            }).slice(0, 4);
        }
    }
]);

app.controller("ShopController", [
         "$scope", "$http", "GameService", "LoadBarService", "GenreService", "CompanyService",
    function ($scope, $http, GameService, LoadBarService, GenreService, CompanyService) {
        var load = [1, 1, 1];

        $scope.SortName = "";

        $scope.Sortings = [
            {
                Name: "По названию",
                Sort: function () {
                    if ($scope.GamesToShow) {
                        $scope.GamesToShow.sort(function (a, b) {
                            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                        });
                    }
                    $scope.SortName = this.Name;
                }
            },
            {
                Name: "По рейтингу",
                Sort: function () {
                    if ($scope.GamesToShow) {
                        $scope.GamesToShow.sort(function (a, b) {
                            return b.rating - a.rating;
                        });
                    }
                    $scope.SortName = this.Name;
                }
            },
            {
                Name: "По отзывам",
                Sort: function () {
                    if ($scope.GamesToShow) {
                        $scope.GamesToShow.sort(function (a, b) {
                            return b.commentNumber - a.commentNumber;
                        });
                    }
                    $scope.SortName = this.Name;
                }
            },
            {
                Name: "По цене",
                Sort: function () {
                    if ($scope.GamesToShow) {
                        $scope.GamesToShow.sort(function (a, b) {
                            return b.price - a.price;
                        });
                    }
                    $scope.SortName = this.Name;
                }
            },
            {
                Name: "По релизу",
                Sort: function () {
                    if ($scope.GamesToShow) {
                        $scope.GamesToShow.sort(function (a, b) {
                            return new Date(b.releaseDate) - new Date(a.releaseDate);
                        });
                    }
                    $scope.SortName = this.Name;
                }
            }
        ];

        function popLoad() {

            load.pop();

            if (load.length === 0) {
                try {
                    LoadBarService.Hide();

                    $scope.ResetFilter();

                    $scope.Sortings[0].Sort();
                } catch (ex) {

                }
            }

        }
        LoadBarService.Show();

        var promGames = GameService.GetAll();
        $scope.Games = [];
        promGames.then(function (value) {
            $scope.Games = value;

            popLoad();
        });

        var promGenres = GenreService.GetAll();
        $scope.Genres = [];
        promGenres.then(function (value) {
            $scope.Genres = value.sort(function (a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });

            popLoad();
        });

        var promCompanies = CompanyService.GetAll();
        $scope.Companies = [];
        promCompanies.then(function (value) {
            $scope.Companies = value.sort(function (a, b) {
                return a.companyName.toLowerCase().localeCompare(b.companyName.toLowerCase());
            });

            popLoad();
        });


        $scope.status = {
            isCustomHeaderOpen: false
        };

        $scope.GamesToShow = [];



        $scope.filterBackup = {
            RateFrom: 0,
            RateTo: 5,
            PriceFrom: 0,
            PriceTo: "",
            Name: "",
            AgeFrom: 0,
            AgeTo: 21,
        }

        $scope.filter = {};

        $scope.DoFilter = function () {
            if (LoadBarService.Get().show)
                return;

            $scope.GamesToShow = $scope.Games;
            var filter = $scope.filter;

            // name
            if (filter.Name) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.title.toLowerCase().includes(filter.Name.toLowerCase());
                });
            }

            // rating
            if (isNumber(filter.RateFrom)) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.rating >= filter.RateFrom;
                });
            }

            if (isNumber(filter.RateTo)) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.rating <= filter.RateTo;
                });
            }

            // age
            if (isNumber(filter.AgeFrom)) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.restrictions >= filter.AgeFrom;
                });
            }

            if (isNumber(filter.AgeTo)) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.restrictions <= filter.AgeTo;
                });
            }

            // price
            if (isNumber(filter.PriceFrom)) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.price >= filter.PriceFrom;
                });
            }

            if (isNumber(filter.PriceTo)) {
                $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                    return val.price <= filter.PriceTo;
                });
            }

            // companies
            if (filter.Companies) {
                if (filter.Companies.length > 0) {
                    $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                        return filter.Companies.includes(val.company.id);
                    });
                }
            }

            // Genres
            if (filter.Genres) {
                if (filter.Genres.length > 0) {
                    $scope.GamesToShow = $scope.GamesToShow.filter(function (val) {
                        var temp = [];

                        val.genres.forEach(function (item, i, arr) {

                            if (filter.Genres.includes(item.id)) {
                                temp.push(1);
                            }

                        });
                        if (temp.length === filter.Genres.length)
                            return true;

                        return false;
                    });
                }
            }
        }

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.ResetFilter = function () {
            $scope.filter = {
                RateFrom: $scope.filterBackup.RateFrom,
                RateTo: $scope.filterBackup.RateTo,
                AgeFrom: $scope.filterBackup.AgeFrom,
                AgeTo: $scope.filterBackup.AgeTo,
                PriceFrom: $scope.filterBackup.PriceFrom,
                PriceTo: $scope.filterBackup.PriceTo,
                Name: $scope.filterBackup.Name,
                Genres: $scope.filterBackup.Genres,
            }
            $scope.DoFilter();

            if ($scope.SortName) {
                $scope.Sortings.find(function (val) {
                    return val.Name === $scope.SortName;
                }).Sort();
            }
        }


        $scope.RevSort = function () {
            $scope.GamesToShow = $scope.GamesToShow.reverse();
        }
    }
]);

app.controller("CartController", [
         "$scope", "$http", "GameService", "LoadBarService", "CartService", "UserService", "$location",
    function ($scope, $http, GameService, LoadBarService, CartService, UserService, $location) {
        var user = UserService.GetUser();
        if (!UserService.IsLogedIn().Value)
            $location.path("/Login");

        LoadBarService.Show();


        $scope.Games = [];
        $scope.GamesToShow = [];


        function UpdateGames() {
            var promGames = GameService.GetAll();

            promGames.then(function (value) {
                $scope.Games = value.filter(function (val) {
                    return CartService.IsInCart(val.id, user.data.id);
                });

                $scope.Games.forEach(function (item, i, arr) {
                    $scope.TotalPrice += item.price;
                });

                $scope.DoFilter();

                LoadBarService.Hide();
            });
        }

        UpdateGames();

        $scope.TotalPrice = 0;


        $scope.filter = "";

        $scope.DoFilter = function () {
            $scope.GamesToShow = $scope.Games.filter(function (val) {
                return val.title.toLowerCase().includes($scope.filter.toLowerCase());
            });
        }

        $scope.MakeOrder = function () {
            if (LoadBarService.Get().show)
                return;
            if ($scope.Games.length === 0)
                return;

            LoadBarService.Show();
            $http({
                url: "Data/Order/Add",
                method: "Post",
                params: {
                    Games: $scope.Games.map(function (val) {
                        return val.id;
                    }),
                    UserId: user.data.id
                },
            }).then(function (val) {
                LoadBarService.Hide();

                CartService.Clear(user.data.id);

                UserService.UpdateUser();

                $location.path("/Library");
            });
        }

        $scope.ClearCart = function () {
            CartService.Clear(user.data.id);
            $scope.TotalPrice = 0;
            UpdateGames();
        }

    }
]);

app.controller("LibraryController", [
         "$scope", "$http", "GameService", "LoadBarService", "CartService", "UserService", "$location", "OrderService",
    function ($scope, $http, GameService, LoadBarService, CartService, UserService, $location, OrderService) {
        var user = UserService.GetUser();
        if (!UserService.IsLogedIn().Value)
            $location.path("/Login");

        LoadBarService.Show();

        var promGames = GameService.GetAll();
        $scope.Games = [];
        $scope.GamesToShow = [];
        promGames.then(function (value) {
            OrderService.GetByUser(user.data.id).then(function (val) {


                $scope.Games = value.filter(function (game) {
                    return val.find(function (element, index, array) {
                        return element.game.id === game.id;
                    });
                });

                $scope.DoFilter();

                LoadBarService.Hide();

            });



        });


        $scope.filter = "";

        $scope.DoFilter = function () {
            $scope.GamesToShow = $scope.Games.filter(function (val) {
                return val.title.toLowerCase().includes($scope.filter.toLowerCase());
            });
        }

    }
]);

app.controller("StatisticsController", [
         "$scope", "$http", "OrderService", "LoadBarService", "UserService", "$location",
    function ($scope, $http, OrderService, LoadBarService, UserService, $location) {
        var user = UserService.GetUser();
        if (!UserService.IsLogedIn().Value)
            $location.path("/Login");

        LoadBarService.Show();

        var prom = OrderService.GetAll();
        $scope.Orders = [];
        prom.then(function (value) {
            $scope.Orders = value;

            initLineAllYears();

            initCirc();

            LoadBarService.Hide();
        });

        $scope.LineAllYears = {};
        function initLineAllYears() {
            try {
                var startDate = new Date(Date.parse($scope.Orders[0].time));
                var startYear = startDate.getFullYear();

                var endDate = new Date(Date.parse($scope.Orders[$scope.Orders.length - 1].time));
                var endYear = endDate.getFullYear();

                $scope.LineAllYears.data = [];
                $scope.LineAllYears.labels = [];
                while (startYear <= endYear) {
                    $scope.LineAllYears.labels.push(startYear);

                    var obs = $scope.Orders.filter(function (val) {
                        return startYear === new Date(Date.parse(val.time)).getFullYear();
                    });

                    var total = 0;

                    obs.forEach(function (item) {
                        total += item.game.price;
                    });

                    $scope.LineAllYears.data.push(total);

                    startYear++;
                }

            } catch (ex) {
                //alert(ex);
            }
        }

        $scope.Cir = {};

        function initCirc() {
            try {
                $scope.Cir.data = [];
                $scope.Cir.labels = $scope.Orders.map(function (val) {
                    return val.user.country.countryName;
                });

                $scope.Cir.labels = $scope.Cir.labels.filter(onlyUnique);

                $scope.Cir.labels.forEach(function (county) {

                    var obs = $scope.Orders.filter(function (val) {
                        return county === val.user.country.countryName;;
                    });

                    var total = 0;

                    obs.forEach(function (item) {
                        total += item.game.price;
                    });

                    $scope.Cir.data.push(total);

                });


            } catch (ex) {
                //alert(ex);
            }
        }


        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
    }
]);

app.controller("UsersController", [
         "$scope", "$http", "LoadBarService", "UserService", "$location",
    function ($scope, $http, LoadBarService, UserService, $location) {
        var user = UserService.GetUser();
        if (!UserService.IsLogedIn().Value)
            $location.path("/Login");

        LoadBarService.Show();


        $scope.Users = [];
        $scope.UsersToShow = [];


        $scope.TotalPrice = 0;

        function UpdateUsers() {
            var prom = UserService.GetAll();
            prom.then(function (value) {
                $scope.Users = value.sort(function (a, b) {
                    return a.username.toLowerCase().localeCompare(b.username.toLowerCase());
                }).filter(function (val) {
                    return val.id !== user.data.id;
                });

                $scope.DoFilter();

                LoadBarService.Hide();
            });
        }

        UpdateUsers();

        $scope.filter = "";

        $scope.DoFilter = function () {
            $scope.UsersToShow = $scope.Users.filter(function (val) {
                return val.username.toLowerCase().includes($scope.filter.toLowerCase());
            });
        }

        $scope.MakeModer = function (id) {
            var user = {
                "Id": id,
                "RoleId": 1
            };
            $http({
                url: "Data/User/SetRole",
                method: "POST",
                data: JSON.stringify(user)
            }).then(function (val) {

                UpdateUsers();
            });
        }

        $scope.MakeUser = function (id) {
            var user = {
                "Id": id,
                "RoleId": 2
            };
            $http({
                url: "Data/User/SetRole",
                method: "POST",
                data: JSON.stringify(user)
            }).then(function (val) {

                UpdateUsers();
            });
        }
    }
]);

app.controller("SearchController", [
    "$scope", "$http", "GameService", "LoadBarService", "$routeParams",
    function ($scope, $http, GameService, LoadBarService, $routeParams) {
        LoadBarService.Show();
        var prom = GameService.GetAll();

        prom.then(function (value) {
            $scope.Games = value.sort(function (a, b) {
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            });
            try {
                $scope.Games = $scope.Games.filter(function (val) {
                    return val.title.toLowerCase().includes($routeParams.str.toLowerCase());
                });



                LoadBarService.Hide();
            } catch (ex) {
                //alert(ex);
            }
        });

        $scope.Games = [];


    }
]);


app.controller("LoginController", [
    "$scope", "UserService", "$location", "LoadBarService", function ($scope, UserService, $location, LoadBarService) {

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
            LoadBarService.Show();
            UserService.Login($scope.Login, $scope.Password).then(function (val) {
                if (val === true)
                    $location.path("/");
                else
                    $scope.errors = ["Не верный логин и/или пароль!"];

                LoadBarService.Hide();
            });
        };
    }
]);
app.controller("RegistrationController", [
    "$scope", "UserService", "$location", "CountryService", "LoadBarService",
    function ($scope, UserService, $location, CountryService, LoadBarService) {
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

        $scope.Country = {};

        $scope.Countries = {};

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

            UserService.Registrate($scope.Login, $scope.Password, $scope.Country).then(function (val) {
                if (val === true)
                    $location.path("/Login");
                else
                    $scope.errors = ["Логин уже используется!"];
            });

        };
    }
]);
app.controller("UpdateUserController", [
    "$scope", "UserService", "$location", "CountryService", "LoadBarService", "$http",
    function ($scope, UserService, $location, CountryService, LoadBarService, $http) {
        LoadBarService.Show();
        var prom = CountryService.GetAll();

        $scope.user = UserService.GetUser();
        if (!UserService.IsLogedIn())
            $location.path("/");


        prom.then(function (value) {
            $scope.Countries = value;

            if ($scope.Countries.length === 0) {
                $scope.Countries = [{
                    id: -1,
                    Name: "Стран не найдено"
                }];
            }

            $scope.Country = $scope.user.data.country.id;
            LoadBarService.Hide();
        });

        $scope.Country = {};

        $scope.Countries = {};

        $scope.Login = "";

        $scope.Password = "";

        $scope.SecPassword = "";

        $scope.OldPassword = "";

        $scope.errors = [];

        $scope.registrate = function () {
            $scope.errors = [];
            if ($scope.Login)
                if ($scope.Login.length < 4)
                    $scope.errors.push("Логин короче 4 символов!");

            if ($scope.Password)
                if ($scope.Password.length < 4)
                    $scope.errors.push("Пароль короче 4 символов!");


            if ($scope.Login.length > 16)
                $scope.errors.push("Логин длиннее 16 символов!");
            if ($scope.Password.length > 16)
                $scope.errors.push("Пароль длиннее 16 символов!");


            if ($scope.Password !== $scope.SecPassword)
                $scope.errors.push("Пароли не совпадают");

            if ($scope.user.data.password !== $scope.OldPassword)
                $scope.errors.push("Не верный старый пароль!");

            if ($scope.errors.length !== 0)
                return;

            var user = {
                "Id": $scope.user.data.id,
                "RoleId": $scope.user.data.role,
                "Login": $scope.Login ? $scope.Login : $scope.user.data.login,
                "Password": $scope.Password ? $scope.Password : $scope.user.data.password,
                "Country.Id": $scope.Country
            };
            $http({
                url: "Data/User/Update",
                method: "POST",
                data: JSON.stringify(user)
            }).then(function (val) {

                if (val.data === "409" || val.data === "404") {
                    $scope.errors = ["Логин уже используется!"];
                    return;
                }

                UserService.LogOff();
                $location.path("/Login");

            });
        };
    }
]);


app.controller("GenresController", [
    "$scope", "$http", "GenreService", "LoadBarService", function ($scope, $http, GenreService, LoadBarService) {
        LoadBarService.Show();
        var prom = GenreService.GetAll();

        prom.then(function (value) {
            if (value.length)
                $scope.Genres = value.sort(function (a, b) {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
            $scope.DoFilter();
            LoadBarService.Hide();
        });

        $scope.Genres = [];

        $scope.GenresToShow = [];

        $scope.filter = "";

        $scope.DoFilter = function () {
            $scope.GenresToShow = $scope.Genres.filter(function (val) {
                return val.name.toLowerCase().includes($scope.filter.toLowerCase());
            });
        }
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

            GenreService.Add($scope.Name, $scope.Desc, function (val) {
                if (val.data === "409") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }
                if (val.data === "404") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }

                $location.path("/Genres");
            });


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

            if (!$scope.genre.id) {
                $location.path("/Genres");
            }
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

            if (!$scope.genre.id) {
                $location.path("/Genres");
            }
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
            },
            function (val) {
                if (val.data === "409") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }
                if (val.data === "404") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }

                $location.path("/Genres");


            }
            );
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

            $scope.DoFilter();
            LoadBarService.Hide();
        });

        $scope.Companies = [];

        $scope.CompaniesToShow = [];

        $scope.filter = "";

        $scope.DoFilter = function () {
            $scope.CompaniesToShow = $scope.Companies.filter(function (val) {
                return val.companyName.toLowerCase().includes($scope.filter.toLowerCase());
            });
        }
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
                if (val.data === "409") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }

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
                if (val.data === "409") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }
                if (val.data === "404") {
                    $scope.errors.push("Название уже занято!");
                    return;
                }

                $location.path("/Companies");
            });


        };
    }
]);


app.controller("GameController", [
    "$scope", "$http", "GameService", "LoadBarService", "$routeParams", "UserService", "$location", "CartService", "$anchorScroll", "OrderService",
    function ($scope, $http, GameService, LoadBarService, $routeParams, UserService, $location, CartService, $anchorScroll, OrderService) {
        if (!$routeParams.id || $routeParams.id < 1) {
            $location.path("/Shop");
        }

        $anchorScroll();
        LoadBarService.Show();

        $scope.User = UserService.GetUser();
        $scope.isAuthenticated = UserService.IsLogedIn();
        $scope.isBought = false;

        $scope.isInCart = false;

        function updateGame() {
            var prom = GameService.Get($routeParams.id);
            prom.then(function (value) {
                $scope.isInCart = CartService.IsInCart(value.id, $scope.User.data.id);

                $scope.Game = value;

                if (!$scope.Game.id) {
                    $location.path("/Shop");
                }

                $scope.Game.releaseDate = Date.parse($scope.Game.releaseDate);

                document.title = value.title;
                UpdateComments();

                var orders = [];
                try {
                    OrderService.GetByGameUser($scope.Game.id, $scope.User.data.id).then(function (val) {
                        orders = val;

                        if (orders.length > 0) {
                            $scope.isBought = true;
                            $scope.Game.orderKey = orders[0].orderKey;
                        }
                    });
                } catch (ex) {

                }



                LoadBarService.Hide();

            });
        }

        function UpdateComments() {
            $http({
                url: "Data/Comment/GetAllById",
                method: "Post",
                data: { id: $scope.Game.id },
            }).then(function (val) {

                var _data = angular.fromJson(val.data);

                _data.forEach(function (item, i, arr) {
                    item.time = Date.parse(item.time);
                });

                $scope.Game.comments = _data.sort(function (a, b) {
                    return b.id - a.id;
                });

            });
        }

        updateGame();
        $scope.Game = {};

        $scope.SetRating = function (n, v) {
            if (!$scope.isAuthenticated.Value) {
                $location.path("/Login");
                return;
            }
            n = n + 1;
            var res = {};

            if (v === 0) {
                res = n;
            } else {
                var r = $scope.Game.rating.toFixed();

                res = n + parseInt(r);
            }


            $http({
                url: "Data/Rating/Set",
                method: "Post",
                data: JSON.stringify({
                    "Value": res,
                    "GameId": $scope.Game.id,
                    "UserId": $scope.User.data.id
                })
            }).then(function () {
                updateGame();
            });
        }

        $scope.Comment = "";
        $scope.AddComment = function () {
            if (!$scope.Comment)
                return;

            if (!$scope.isAuthenticated.Value) {
                $location.path("/Login");
                return;
            }

            $http({
                url: "Data/Comment/Add",
                method: "Post",
                data: JSON.stringify({
                    "Value": $scope.Comment,
                    "GameId": $scope.Game.id,
                    "UserId": $scope.User.data.id
                })
            }).then(function () {
                UpdateComments();
                $scope.Comment = "";
            });
        }
        $scope.DeleteComment = function (id) {

            $http({
                url: "Data/Comment/Delete",
                method: "Post",
                data: { "id": id }
            }).then(function () {
                UpdateComments();
            });
        }


        $scope.AddToCart = function () {
            CartService.Add($scope.Game.id, $scope.User.data.id);

            $scope.isInCart = true;
        }

        $scope.DeleteFromCart = function () {
            CartService.Remove($scope.Game.id, $scope.User.data.id);

            $scope.isInCart = false;
        }

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
                    Name: "Студий не найдено"
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

            if ($scope.model.Name.length > 30)
                $scope.errors.push("Название длиннее 30 символов!");
            if ($scope.model.Description > 300)
                $scope.errors.push("Описание длиннее 300 символов!");

            if (!$scope.model.DateOut)
                $scope.errors.push("Не указана Дата Выхода!");

            if (!imgPicked)
                $scope.errors.push("Не выбрано изображение!");

            if ($scope.chosenGenres.length === 0)
                $scope.errors.push("Не выбран ни один жанр!");

            if ($scope.errors.length !== 0)
                return;

            LoadBarService.Show();

            var model = {
                "Name": $scope.model.Name,
                "Description": $scope.model.Description,
                "DateOut": $scope.model.DateOut,
                "Company.Id": $scope.model.Company.Id,
                "Price": $scope.model.Price,
                "Age": $scope.model.Age,
                "GenreIds": $scope.chosenGenres,
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
                if (val.data === "409") {
                    $scope.errors = ["Название уже используется!"];
                    LoadBarService.Hide();
                    return;
                } else {
                    LoadBarService.Hide();
                    $location.path("/Shop");
                }


            });


        };
    }
]);
app.controller("EditGameController", [
    "$scope", "$http", "$location", "LoadBarService", "GameService", "CompanyService", "GenreService", "$routeParams",
    function ($scope, $http, $location, LoadBarService, GameService, CompanyService, GenreService, $routeParams) {
        $scope.model = {};

        LoadBarService.Show();
        var load = [1, 1, 1];

        var promCompanies = CompanyService.GetAll();
        promCompanies.then(function (value) {
            $scope.Companies = value.sort(function (a, b) {
                return a.companyName.toLowerCase().localeCompare(b.companyName.toLowerCase());
            });

            if ($scope.Companies.length === 0) {
                $scope.Companies = [{
                    id: -1,
                    Name: "Студий не найдено"
                }];
            }

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

            popLoad();
        });

        var promGame = GameService.Get($routeParams.id);
        promGame.then(function (value) {
            $scope.model = value;

            if (!$scope.model.id) {
                $location.path("/Shop");
            }

            $scope.img = $scope.model.poster;
            $scope.chosenGenres = $scope.model.genres.map(function (a) { return a.id; });;
            $scope.model.restrictions = Number($scope.model.restrictions);
            $scope.model.releaseDate = new Date($scope.model.releaseDate);
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
            $scope.img = $scope.model.poster;
            var imgPicked = false;
            $scope.file = "";
        }

        $scope.img = "/Content/Images/Technical/noimagefound.jpg";

        $scope.file = "";

        $scope.Companies = {};

        $scope.chosenGenres = [];

        $scope.Genres = [];

        $scope.errors = [];


        $scope.EditGame = function () {
            if (LoadBarService.Get().show)
                return;
            $scope.errors = [];


            if (!$scope.model.title)
                $scope.errors.push("Поле \"Название\" не заполнено!");
            else if ($scope.model.title.length < 4)
                $scope.errors.push("Название короче 4 символов!");

            if ($scope.model.title.length > 30)
                $scope.errors.push("Название длиннее 30 символов!");

            if ($scope.model.description)
                if ($scope.model.description.length > 300)
                    $scope.errors.push("Описание длиннее 300 символов!");

            if ($scope.model.systemRequirements)
                if ($scope.model.systemRequirements.length > 300)
                    $scope.errors.push("Системные требования длиннее 300 символов!");

            if (!$scope.model.releaseDate)
                $scope.errors.push("Не указана Дата Выхода!");

            if ($scope.errors.length !== 0)
                return;

            LoadBarService.Show();

            var model = {
                "Id": $scope.model.id,
                "Name": $scope.model.title,
                "Description": $scope.model.description,
                "DateOut": $scope.model.releaseDate,
                "Company.Id": $scope.model.company.id,
                "Price": $scope.model.price,
                "Age": $scope.model.restrictions,
                "GenreIds": $scope.chosenGenres,
                "Requirements": $scope.model.systemRequirements,
                "ImageUrl": $scope.model.poster,
                "Rating": $scope.model.rating
            }

            $http({
                url: "Data/Game/Edit",
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

        $scope.Cancel = function () {
            $location.path("/Game/" + $routeParams.id);
        }
    }
]);
app.controller("DeleteGameController", [
    "$scope", "$http", "GameService", "$routeParams", "$location", "LoadBarService",
    function ($scope, $http, GameService, $routeParams, $location, LoadBarService) {
        LoadBarService.Show();
        if (!$routeParams.id || $routeParams.id < 1) {
            $location.path("/Shop");
        }

        var promGame = GameService.Get($routeParams.id);
        promGame.then(function (value) {
            $scope.model = value;

            if (!$scope.model.id) {
                $location.path("/Shop");
            }

            LoadBarService.Hide();
        });

        $scope.model = {};

        $scope.Cancel = function () {
            $location.path("/Game/" + $routeParams.id);
        }

        $scope.Delete = function () {
            if (LoadBarService.Get().show)
                return;

            var model = {
                Id: $scope.model.id,
                ImageUrl: $scope.model.poster
            }
            GameService.Delete(model);
            $location.path("/Shop");
        }
    }
]);

// services
app.service("SideMenuService", function () {
    var items = [
        {
            name: "Главная",
            checked: false,
            url: "/",
            roles: [0, 1, 2]
        },
        {
            name: "Магазин",
            checked: false,
            url: "/Shop",
            roles: [0, 1, 2]
        },
        {
            name: "Библиотека",
            checked: false,
            url: "/Library",
            roles: [0, 1, 2]
        },
        {
            name: "Корзина",
            checked: false,
            url: "/Cart",
            icon: "glyphicon glyphicon-shopping-cart",
            roles: [0, 1, 2]
        },
        {
            name: "Separator",
            roles: [0, 1]
        },
        {
            name: "Жанры",
            checked: false,
            url: "/Genres",
            roles: [0, 1]
        },
        {
            name: "Студии",
            checked: false,
            url: "/Companies",
            roles: [0, 1]
        },
        {
            name: "Пользователи",
            checked: false,
            url: "/Users",
            roles: [0]
        },
        {
            name: "Статистика",
            checked: false,
            url: "/Statistics",
            roles: [0]
        },
    ];

    function Reset() {
        items.forEach(function (it, i, arr) {
            it.checked = false;
        });
    }

    return {
        Check: function (url, role) {
            Reset();

            items.forEach(function (it, i, arr) {
                it.show = false;
                if (it.url === url)
                    it.checked = true;
                if (it.roles.includes(role)) {
                    it.show = true;
                }
            });
        },
        Get: function () {
            return items;
        }
    };
});

app.service("UserService", ["$http", "$q",
    function ($http, $q) {
        var user = {
            data: {

            }
        };

        var logedIn = {};

        function ClearUser() {
            user.data = {};

            logedIn.Value = false;
        }

        function InitUser() {
            try {
                var ob = JSON.parse(localStorage.getItem("userData"));

                if (ob) {
                    logedIn.Value = true;
                    user.data = ob;
                }
            } catch (ex) {

            }
        }

        return {
            Login: function (lg, pas) {

                var def = $q.defer();
                var us = {
                    "Login": lg,
                    "Password": pas
                };

                $http({
                    url: "/Data/User/Login",
                    method: "Post",
                    data: JSON.stringify(us)
                }).then(function (val) {

                    if (val.data !== "409") {
                        try {
                            logedIn.Value = true;
                            user.data.login = lg;
                            user.data.password = pas;
                            user.data.id = val.data.id;
                            user.data.role = val.data.userRole;
                            user.data.country = {};
                            user.data.country.id = val.data.country.id;
                            user.data.balance = val.data.balance;

                            localStorage.setItem("userData", JSON.stringify(user.data));

                            def.resolve(true);
                        } catch (ex) {
                            //alert(ex);
                        }
                    }


                    def.resolve(false);
                });


                return def.promise;

            },
            Registrate: function (lg, pas, Country) {
                var def = $q.defer();
                var user = {
                    "Login": lg,
                    "Password": pas,
                    "Country.Id": Country
                };
                $http({
                    url: "Data/User/Create",
                    method: "POST",
                    data: JSON.stringify(user)
                }).then(function (val) {

                    if (val.data === "409") {
                        def.resolve(false);
                    }

                    def.resolve(true);
                });


                return def.promise;
            },
            LogOff: function () {
                localStorage.setItem("userData", "");

                ClearUser();
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
            },
            GetAll: function () {

                var def = $q.defer();


                $http({
                    url: "/Data/User/GetAll",
                    method: "Post",
                }).then(function (val) {
                    var _data = angular.fromJson(val.data);
                    def.resolve(_data);
                    return val;
                });


                return def.promise;

            },
            UpdateUser: function () {
                var us = this.GetUser();

                this.Login(us.data.login, us.data.password);
            },
        };
    }
]);

app.service("GenreService", ["$http", "$q",
    function ($http, $q) {

        return {
            Add: function (name, desc, callback) {

                var genre = {
                    "Name": name,
                    "Description": desc
                };

                $http({
                    url: "Data/Genre/Add",
                    method: "Post",
                    data: JSON.stringify(genre)
                }).then(function (val) {

                    callback(val);

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
            Edit: function (model, callback) {


                $http({
                    url: "Data/Genre/Edit",
                    data: JSON.stringify(model),
                    method: "Post",
                }).then(function (val) {

                    callback(val);

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

app.service("CartService", ["$http", "$q",
    function () {

        return {
            IsInCart: function (gameId, userId) {

                var cart = localStorage.getItem("cart");

                if (!cart) {
                    cart = [];
                } else {
                    cart = JSON.parse(cart);
                }


                for (var j = 0; j < cart.length; j++) {
                    if (cart[j].userId === userId && cart[j].gameId === gameId) {
                        return true;
                    }
                }


                return false;
            },
            Add: function (gameId, userId) {
                var cart = localStorage.getItem("cart");
                if (!cart) {
                    cart = [];
                } else {
                    cart = JSON.parse(cart);
                }

                cart.push({
                    "gameId": gameId,
                    "userId": userId
                });

                localStorage.setItem("cart", JSON.stringify(cart));
            },
            Remove: function (gameId, userId) {

                var cart = localStorage.getItem("cart");

                cart = JSON.parse(cart);

                cart.splice(cart.indexOf({
                    "gameId": gameId,
                    "userId": userId
                }), 1);

                localStorage.setItem("cart", JSON.stringify(cart));

            },
            Clear: function (userId) {
                var cart = localStorage.getItem("cart");

                cart = JSON.parse(cart);

                while (true) {
                    var ob = cart.find(function (element, index, array) {
                        return element.userId === userId;
                    });

                    if (!ob)
                        break;
                    else {
                        var index = cart.indexOf(ob);

                        cart.splice(index, 1);
                    }
                }


                localStorage.setItem("cart", JSON.stringify(cart));
            }
        }

    }
]);

app.service("OrderService", ["$http", "$q",
    function ($http, $q) {


        return {
            GetByGameUser: function (gameId, userId) {

                var def = $q.defer();

                $http({
                    url: "Data/Order/GetAll",
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);


                    _data = _data.filter(function (val) {
                        return val.game.id === gameId && val.user.id === userId;
                    });


                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },
            GetByUser: function (userId) {

                var def = $q.defer();

                $http({
                    url: "Data/Order/GetAll",
                    method: "Post",
                }).then(function (val) {

                    try {
                        var _data = angular.fromJson(val.data);

                        if (_data.length)
                            _data = _data.filter(function (val) {
                                return val.user.id === userId;
                            });

                    } catch (ex) {
                        //alert(ex);

                    }

                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },
            GetAll: function () {

                var def = $q.defer();

                $http({
                    url: "Data/Order/GetAll",
                    method: "Post",
                }).then(function (val) {

                    var _data = angular.fromJson(val.data);

                    def.resolve(_data);
                    return val;

                });

                return def.promise;
            },
        }

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
app.directive("resizer", ["$window", function ($window) {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            if ($window.innerWidth > attrs.winSize)
                elem.addClass(attrs.resizer);
            else elem.removeClass(attrs.resizer);

            angular.element($window).on("resize", function () {
                if ($window.innerWidth > attrs.winSize)
                    elem.addClass(attrs.resizer);
                else elem.removeClass(attrs.resizer);
            });
        }
    }
}]);

app.directive("gameTile", function () {
    return {
        templateUrl: "html/Game/GameTile.html",
    };
});

// filters
app.filter('range', function () {
    return function (val, range) {
        range = parseInt(range);
        for (var i = 0; i < range; i++)
            val.push(i);
        return val;
    };
});

// listeners
app.run(["$rootScope", "$route", "SideMenuService", "$location", "UserService",
    function ($rootScope, $route, SideMenuService, $location, UserService) {
        $rootScope.$on("$routeChangeSuccess", function () {
            document.title = $route.current.title;
            var user = UserService.GetUser();
            var url = $location.path();

            var e = angular.equals(user.data, {});
            SideMenuService.Check(url, !e ? user.data.role : 2);
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
                title: "GameStore"
            })
            .when("/Home/Layout/",
            {
                templateUrl: "Views/Angular/Index.html",
                controller: "IndexController",
                title: "GameStore"
            })

             .when("/Shop",
            {
                templateUrl: "html/Shop.html",
                controller: "ShopController",
                title: "Магазин"
            })
             .when("/Cart",
            {
                templateUrl: "html/Cart.html",
                controller: "CartController",
                title: "Корзина"
            })
             .when("/Library",
            {
                templateUrl: "html/Library.html",
                controller: "LibraryController",
                title: "Библиотека"
            })
             .when("/Users",
            {
                templateUrl: "html/Users.html",
                controller: "UsersController",
                title: "Пользователи"
            })
             .when("/Statistics",
            {
                templateUrl: "html/Statistics.html",
                controller: "StatisticsController",
                title: "Статистика"
            })

            .when("/Search/:str",
            {
                templateUrl: "html/Search.html",
                controller: "SearchController",
                title: "Поиск"
            })

            .when("/Login",
            {
                templateUrl: "html/User/Login.html",
                controller: "LoginController",
                title: "Войти"
            })
            .when("/Registration",
            {
                templateUrl: "html/User/Registration.html",
                controller: "RegistrationController",
                title: "Регистрация"
            })
             .when("/UpdateUser",
            {
                templateUrl: "html/User/UpdateUser.html",
                controller: "UpdateUserController",
                title: "Настройки"
            })

            .when("/Genres",
            {
                templateUrl: "html/Genre/AllGenres.html",
                controller: "GenresController",
                title: "Жанры"
            })
            .when("/Genre/Add",
            {
                templateUrl: "html/Genre/AddGenre.html",
                controller: "AddGenreController",
                title: "Добавить жанр"
            })
            .when("/Genre/Delete/:id",
            {
                templateUrl: "html/Genre/DeleteGenre.html",
                controller: "DeleteGenreController",
                title: "Удалить жанр"
            })
            .when("/Genre/Edit/:id",
            {
                templateUrl: "html/Genre/EditGenre.html",
                controller: "EditGenreController",
                title: "Редактировать жанр"
            })

            .when("/Companies",
            {
                templateUrl: "html/Company/AllCompanies.html",
                controller: "CompaniesController",
                title: "Студии"
            })
            .when("/Company/Add",
            {
                templateUrl: "html/Company/AddCompany.html",
                controller: "AddCompanyController",
                title: "Добавить студию"
            })
            .when("/Company/Delete/:id",
            {
                templateUrl: "html/Company/DeleteCompany.html",
                controller: "DeleteCompanyController",
                title: "Удалить студию"
            })
            .when("/Company/Edit/:id",
            {
                templateUrl: "html/Company/EditCompany.html",
                controller: "EditCompanyController",
                title: "Редактировать студию"
            })

            .when("/Games",
            {
                templateUrl: "html/Company/AllCompanies.html",
                controller: "CompaniesController",
                title: "Студии"
            })
            .when("/Game/Add",
            {
                templateUrl: "html/Game/AddGame.html",
                controller: "AddGameController",
                title: "Добавить игру"
            })
            .when("/Game/Delete/:id",
            {
                templateUrl: "html/Game/DeleteGame.html",
                controller: "DeleteGameController",
                title: "Удалить игру"
            })
            .when("/Game/Edit/:id",
            {
                templateUrl: "html/Game/EditGame.html",
                controller: "EditGameController",
                title: "Редактировать игру"
            })
            .when("/Game/:id",
            {
                templateUrl: "html/Game/Game.html",
                controller: "GameController",
                title: ""
            })

            .otherwise({ redirectTo: "/" });

        $locationProvider.html5Mode(true);
    }
]);

app.config(["$qProvider", function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
