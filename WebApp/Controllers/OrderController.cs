using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DAO.Helpers;
using Models;

namespace WebApp.Controllers
{
    public class OrderController : Controller
    {
        [HttpPost]
        public void Add(IEnumerable<int> games, int? userId)
        {
            foreach (var game in games)
            {
                OrderModel model = new OrderModel
                {
                    GameId = game,
                    UserId = userId
                };


                HttpActions.Post(ServiceURL.Main + "/order/add", model.ToJObject().ToString());
            }


        }


        [HttpPost]
        public string GetAll()
        {

            return HttpActions.Get(ServiceURL.Main + "/order/" + ServiceURL.GetAll);

        }
    }
}