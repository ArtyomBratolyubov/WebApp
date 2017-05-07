using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using DAO;
using Models;
using WebApp.Helpers;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class CompanyController : Controller
    {
        private CompanyService service = new CompanyService();

        [HttpPost]
        public void Add(CompanyModel model)
        {
            string base64 = Request.Form.ToString();

            string path = Server.MapPath("/");

            if (base64.Length != 0)
            {
                model.ImageUrl = "/Content/Images/All/" + ImagesHelper.SaveImage(base64, path);
            }
            else
            {
                model.ImageUrl = "/Content/Images/Technical/noimagefound.jpg";
            }
            service.Add(model);

        }

        [HttpPost]
        public void Edit(CompanyModel model)
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