using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Models;
using Newtonsoft.Json.Linq;

namespace WebApp.Models
{
    public class UserModel
    {
        public int? Id { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }

        public int? RoleId { get; set; }

        public CountryModel Country { get; set; }


        public JObject ToJObject()
        {
            dynamic json = new JObject();
            json.id = Id;
            json.username = Login;
            json.password = Password;
            json.userRole = RoleId ?? 2;
            json.country = new JObject();
            json.country.id = Country?.Id;

            return json;
        }
    }
}