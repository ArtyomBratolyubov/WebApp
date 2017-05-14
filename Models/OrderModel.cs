using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using WebApp.Models;

namespace Models
{
    public class OrderModel
    {

        public int? Id { get; set; }

        public int? UserId { get; set; }

        public int? GameId { get; set; }

        public JObject ToJObject()
        {
            dynamic json = new JObject();
            json.id = Id;

            json.orderKey = Guid.NewGuid().ToString().Substring(4,19);

            json.game = new JObject();
            json.game.id = GameId;

            json.user = new JObject();
            json.user.id = UserId;

            //json.time = DateTime.Now.ToString();

            return json;
        }

    }
}