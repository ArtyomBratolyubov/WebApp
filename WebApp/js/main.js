var app = angular.module("main", ["ngRoute", "ui.bootstrap", "ngAnimate", "ngTouch"]);

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

    $scope.ItemClicked = function (item) {
        SideMenuService.Reset();

        item.checked = true;
    }
});


app.controller("BgImgController", [
    "$scope", "$interval", "$timeout", function ($scope, $interval, $timeout) {

        var srcs = ["bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg", "bg5.jpg"];

        var cur = localStorage.getItem("bgCur");

        $scope.srcBg = "../../Content/Images/Technical/" + srcs[cur];

        $scope.tempBg = "../../Content/Images/Technical/" + srcs[cur];

        $scope.showTemp = false;

        $interval(function () {

            cur++;


            if (cur > srcs.length - 1)
                cur = 0;

            localStorage.setItem("bgCur", cur);

            $scope.showTemp = true;
            $scope.tempBg = "../../Content/Images/Technical/" + srcs[cur];

            $timeout(function () {
                $scope.srcBg = $scope.tempBg;
                $scope.showTemp = false;
            },
                1000);

        },
            30000);

    }
]);

app.controller("NavBarController", [
    "$scope", "UserService", "$location", function ($scope, UserService, $location) {

        $scope.isCollapsed = true;

        $scope.isAuthenticated = UserService.IsLogedIn();

        $scope.User = UserService.GetUser();

        $scope.logOff = function () {
            UserService.LogOff();
            $location.path("/");
        }


    }
]);

app.controller("LoginController", [
    "$scope",  "UserService", "$location", "SideMenuService", function ($scope, UserService, $location, SideMenuService) {
        SideMenuService.Reset();

        $scope.Login = "";

        $scope.Password = "";

        $scope.errors = [];

        $scope.login = function () {
            $scope.errors = [];
            if (!$scope.Login)
                $scope.errors.push("Login field is required!");
            if (!$scope.Password)
                $scope.errors.push("Password field is required!");
            if ($scope.Login.length > 16)
                $scope.errors.push("Login is longer then 16");
            if ($scope.Password.length > 16)
                $scope.errors.push("Password is longer then 16");

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
    "$scope", "UserService", "$location", "SideMenuService", function ($scope, UserService, $location,SideMenuService) {

        SideMenuService.Reset();

        $scope.Login = "";

        $scope.Password = "";

        $scope.SecPassword = "";

        $scope.errors = [];

        $scope.registrate = function () {
            $scope.errors = [];
            if (!$scope.Login)
                $scope.errors.push("Login field is required!");
            if (!$scope.Password)
                $scope.errors.push("Password field is required!");
            if ($scope.Login.length > 16)
                $scope.errors.push("Login is longer then 16!");
            if ($scope.Password.length > 16)
                $scope.errors.push("Password is longer then 16!");
            if ($scope.Password !== $scope.SecPassword)
                $scope.errors.push("Passwords do not match!");

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


app.controller("IndexController", [
    "$scope", "$http", "SideMenuService", function ($scope, $http, SideMenuService) {
       

        SideMenuService.Reset();

        SideMenuService.Get()[0].checked = true;

    }
]);


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
        url: "/"
    },
    {
        name: 'Библиотека',
        checked: false,
        url: "/"
    },
    ];

    return {
        Get: function () { return items; },
        Reset: function () {
            items.forEach(function (it, i, arr) {
                it.checked = false;
            });
        }
    };
});



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

app.service("UserService", ["$http", "$q",
    function ($http, $q) {
        var user = {};
        InitUser();

        var logedIn = {};

        function ClearUser() {
            user.login = "";

            user.password = "";

            user.id = -1;

            user.role = -1;
        }

        function InitUser() {
            user.login = localStorage.getItem("login");
            user.password = localStorage.getItem("pas");
            user.id = localStorage.getItem("userId");
            user.role = localStorage.getItem("role");
        }

        return {
            Login: function (lg, pas) {
                var def = $q.defer();

                $http({
                    url: "/Data/Login",
                    method: "Get",
                    params: {
                        "login": lg,
                        "password": pas
                    }
                }).then(function (val) {

                    if (val.data !== -1) {
                        logedIn.Value = true;
                        user.login = lg;
                        user.password = pas;
                        user.id = val.data.Id;
                        user.role = val.data.Role;

                        localStorage.setItem("login", user.login);
                        localStorage.setItem("pas", user.password);
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("role", user.role);

                        def.resolve(true);
                    }


                    def.resolve(false);
                });


                return def.promise;
            },
            Registrate: function (lg, pas) {
                var def = $q.defer();

                $http({
                    url: "/Data/Registrate",
                    method: "Get",
                    params: {
                        "login": lg,
                        "password": pas
                    }
                }).then(function (val) {

                    if (val.data !== 0) {
                        def.resolve(false);
                    }

                    def.resolve(true);
                });


                return def.promise;
            },
            LogOff: function () {
                localStorage.setItem("login", "");
                localStorage.setItem("pas", "");
                localStorage.setItem("userId", "");
                localStorage.setItem("role", -1);
                logedIn.Value = false;

                ClearUser();
            },
            IsLogedIn: function () {
                if (logedIn.Value)
                    return logedIn;
                else {
                    if (!localStorage.getItem("userId")) {
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

app.run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
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
            .when("/Home/AddImage",
            {
                templateUrl: "Views/Angular/Image/AddImage.html",
                controller: "AddImageController"
            })
            .when("/Home/AddAlbum",
            {
                templateUrl: "Views/Angular/Album/AddAlbum.html",
                controller: "AddAlbumController"
            })
            .when("/Home/Albums",
            {
                templateUrl: "Views/Angular/Album/Albums.html",
                controller: "AlbumsController"
            })
            .when("/Home/Login",
            {
                templateUrl: "html/User/Login.html",
                controller: "LoginController",
                title: 'Войти'
            })
            .when("/Home/Cart",
            {
                templateUrl: "Views/Angular/Cart/Cart.html",
                controller: "CartController"
            })
            .when("/Home/Registration",
            {
                templateUrl: "html/User/Registration.html",
                controller: "RegistrationController",
                title: 'Регистрация'
            })
            .when("/Home/Album/:id",
            {
                templateUrl: "Views/Angular/Image/Images.html",
                controller: "ImagesController"
            })
            .otherwise({ redirectTo: "/" });

        $locationProvider.html5Mode(true);
    }
]);
