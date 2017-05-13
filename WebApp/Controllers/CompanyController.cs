using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using DAO;
using DAO.Services;
using Models;
using WebApp.Helpers;
using WebApp.Models;

namespace WebApp.Controllers
{
    public class CompanyController : Controller
    {
        private CompanyService service = new CompanyService();

        [HttpPost]
        public string Add(CompanyModel model)
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

            return service.Add(model);

        }

        [HttpPost]
        public string Edit(CompanyModel model)
        {
            string base64 = Request.Form.ToString();

            string path = Server.MapPath("/");

            if (base64.Length != 0)
            {
                ImagesHelper.DeleteImage(model.ImageUrl, path);
                model.ImageUrl = "/Content/Images/All/" + ImagesHelper.SaveImage(base64, path);
            }

            return service.Edit(model);
        }

        [HttpPost]
        public void Delete(CompanyModel model)
        {
            string path = Server.MapPath("/");
            ImagesHelper.DeleteImage(model.ImageUrl, path);
            service.Remove(model.Id.Value);
        }

        [HttpPost]
        public JsonResult Get(int? id)
        {
            return Json(service.Get((int)id), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public string GetAll()
        {
            return service.All;
        }
    }
}