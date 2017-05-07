using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class UserController : Controller
    {
        [HttpPost]
        public JsonResult Login(UserModel model)
        {
            // login check logics

            return Json(0, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(UserModel model)
        {


            return Json(0, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void LogOff()
        {

        }

    }
}
