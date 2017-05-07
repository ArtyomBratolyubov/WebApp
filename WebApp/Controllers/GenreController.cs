using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using DAO;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class GenreController : Controller
    {
        private GenreService service = new GenreService();

        [HttpPost]
        public void Add(GenreModel model)
        {
            service.Add(model);

        }

        [HttpPost]
        public void Edit(GenreModel model)
        {
            service.Edit(model);
        }

        [HttpPost]
        public void Delete(int? id)
        {
            service.Remove((int)id);
        }

        [HttpPost]
        public JsonResult Get(int? id)
        {
            return Json(service.Get((int)id), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAll()
        {
            return Json(service.All.OrderBy(m => m.Name), JsonRequestBehavior.AllowGet);
        }
    }
}