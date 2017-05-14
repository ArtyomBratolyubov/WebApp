using System.Collections.Generic;
using System.Linq;
using DAO.Helpers;
using WebApp.Models;

namespace DAO.Services
{
    public class UserService
    {

        public string All => HttpActions.Get(ServiceURL.UserGetAll);

        public string Add(UserModel model)
        {
            string resp = HttpActions.Post(ServiceURL.UserAdd, model.ToJObject().ToString());

            return resp;
        }

        public string Login(UserModel model)
        {
            string resp = HttpActions.Post(ServiceURL.UserLogin, model.ToJObject().ToString());

            return resp;
        }


        public string Get(int id)
        {
            return HttpActions.Get(ServiceURL.GenreGet + '/' + id);
        }

        public string Edit(UserModel model)
        {
            string resp = HttpActions.Post(ServiceURL.UserEdit, model.ToJObject().ToString());

            return resp;
        }

        public string SetRole(int userId, int role)
        {
            string resp = HttpActions.Post(ServiceURL.User+ "/set/role/"+role+"?userId="+userId, "");

            return resp;
        }
    }


}
