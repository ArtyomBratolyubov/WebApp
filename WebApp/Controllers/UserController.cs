using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAO.Services;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class UserController : Controller
    {

        private UserService service = new UserService();

        [HttpPost]
        public string Login(UserModel model)
        {

            return service.Login(model);
        }

        [HttpPost]
        public string GetAll()
        {

            return service.All;
        }

        [HttpPost]
        public string Create(UserModel model)
        {
            return service.Add(model);
        }

        [HttpPost]
        public void LogOff()
        {

        }

        [HttpPost]
        public string Update(UserModel model)
        {
            return service.Edit(model);
        }

    }
}
