using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using WebApp.Models;

namespace Models
{
    public class GameModel
    {

        public int? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public CompanyModel Company { get; set; }

        public List<GenreModel> Genres { get; set; }

        public List<int> GenreIds { get; set; }

        public string Requirements { get; set; }

        public int? Age { get; set; }

        public int? Price { get; set; }

        public int? Rating { get; set; }

        public DateTime? DateOut { get; set; }

        public JObject ToJObject()
        {
            dynamic json = new JObject();
            json.id = Id;
            json.title = Name;
            json.description = Description;
            json.systemRequirements = Requirements;
            json.price = Price;
            json.releaseDate = DateOut.Value.ToString("yyyy-MM-dd");
            json.poster = ImageUrl;
            json.restrictions = Age;
            json.company = new JObject();
            json.company.id = Company.Id;
            json.rating = Rating ?? 0;

            return json;
        }

    }
}