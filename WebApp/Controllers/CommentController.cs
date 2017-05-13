using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAO.Helpers;
using Models;

namespace WebApp.Controllers
{
    public class CommentController : Controller
    {
        [HttpPost]
        public void Add(CommentModel model)
        {
            HttpActions.Post(ServiceURL.Main + "/comment/add", model.ToJObject().ToString());
        }

        [HttpPost]
        public void Delete(int? id)
        {
            HttpActions.Post(ServiceURL.Main + "/comment" + ServiceURL.Delete + "/" + id, "");

        }

        [HttpPost]
        public string GetAllById(int? id)
        {
            return HttpActions.Get(ServiceURL.Game + "/get/comments/" + id);

        }
    }
}