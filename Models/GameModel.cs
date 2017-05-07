using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Models;

namespace WebApp.Models
{
    public class GameModel
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public int Cost { get; set; }

        public IEnumerable<GenreModel> Genres { get; set; }

        public CompanyModel Company { get; set; }

    }
}