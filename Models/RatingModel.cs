using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using WebApp.Models;

namespace Models
{
    public class RatingModel
    {

        public int? Id { get; set; }

        public string Value { get; set; }

        public int? UserId { get; set; }

        public int? GameId { get; set; }

        public JObject ToJObject()
        {
            dynamic json = new JObject();
            json.id = Id;
            json.value = Value;

            json.game = new JObject();
            json.game.id = GameId;

            json.user = new JObject();
            json.user.id = UserId;

            return json;
        }

    }
}