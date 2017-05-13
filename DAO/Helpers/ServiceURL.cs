namespace DAO.Helpers
{


    public static class ServiceURL
    {
        public static readonly string Main = "http://localhost:8080";

        public static readonly string Registrate = Main + "Registrate/";


        public static readonly string Add = "/add";

        public static readonly string GetAll = "/list";

        public static readonly string Get = "/get";

        public static readonly string Edit = "/update";

        public static readonly string Delete = "/delete";


        public static readonly string User = Main + "/user";

        public static readonly string UserLogin = User + "/login";

        public static readonly string UserAdd = User + "/register";

        public static readonly string UserGetAll = User + GetAll;

        public static readonly string UserEdit = User + Edit;

        public static readonly string UserGet = User + Get;



        public static readonly string Company = Main + "/company";

        public static readonly string CompanyAdd = Company + Add;

        public static readonly string CompanyGetAll = Company + GetAll;

        public static readonly string CompanyDelete = Company + Delete;

        public static readonly string CompanyEdit = Company + Edit;

        public static readonly string CompanyGet = Company + Get;


        public static readonly string Country = Main + "/country";

        public static readonly string CountryGetAll = Country + GetAll;


        public static readonly string Genre = Main + "/genre";

        public static readonly string GenreAdd = Genre + Add;

        public static readonly string GenreGetAll = Genre + GetAll;

        public static readonly string GenreDelete = Genre + Delete;

        public static readonly string GenreEdit = Genre + Edit;

        public static readonly string GenreGet = Genre + Get;


        public static readonly string Game = Main + "/game";

        public static readonly string GameAdd = Game + Add;

        public static readonly string GameGetAll = Game + GetAll;

        public static readonly string GameDelete = Game + Delete;

        public static readonly string GameEdit = Game + Edit;

        public static readonly string GameGet = Game + Get;
    }
}