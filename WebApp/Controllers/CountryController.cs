using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using DAO;
using DAO.Services;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class CountryController : Controller
    {
        private CountryService service = new CountryService();

        [HttpPost]
        public JsonResult GetAll()
        {
            return Json(service.All, JsonRequestBehavior.AllowGet);
        }

    }
}