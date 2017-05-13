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
    public class GameController : Controller
    {
        private GameService service = new GameService();

        [HttpPost]
        public void Add(GameModel model)
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
        public void Edit(GameModel model)
        {
            string base64 = Request.Form.ToString();

            string path = Server.MapPath("/");

            if (base64.Length != 0)
            {
                ImagesHelper.DeleteImage(model.ImageUrl, path);
                model.ImageUrl = "/Content/Images/All/" + ImagesHelper.SaveImage(base64, path);
            }

            service.Edit(model);
        }

        [HttpPost]
        public void Delete(GameModel model)
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