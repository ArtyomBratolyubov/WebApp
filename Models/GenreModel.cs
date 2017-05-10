using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace WebApp.Models
{
    public class GenreModel
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public JObject ToJObject()
        {
            dynamic json = new JObject();

            if(Id!=null)
                json.id = Id;
            json.name = Name;
            json.genreDescription = Description;

            return json;
        }

    }
}