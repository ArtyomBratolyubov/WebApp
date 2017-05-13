using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAO.Helpers;
using Models;

namespace WebApp.Controllers
{
    public class RatingController : Controller
    {
        [HttpPost]
        public void Set(RatingModel model)
        {
            HttpActions.Post(ServiceURL.Main + "/rating/saveupdate", model.ToJObject().ToString());
        }
    }
}