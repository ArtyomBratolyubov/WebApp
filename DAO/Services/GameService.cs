using System.Collections.Generic;
using System.Linq;
using DAO.Helpers;
using Models;
using Newtonsoft.Json.Linq;

namespace DAO.Services
{
    public class GameService
    {

        public string All
        {
            get
            {
                var resp = HttpActions.Get(ServiceURL.GameGetAll);
                return resp;
            }
        }

        public void Add(GameModel model)
        {

            string resp = HttpActions.Post(ServiceURL.GameAdd, model.ToJObject().ToString());

            JObject json = JObject.Parse(resp);

            foreach (var id in model.GenreIds)
            {
                HttpActions.Post(ServiceURL.Game + "/set/genre/" + id + "?gameId=" + json["id"], "");
            }
        }


        public void Remove(int id)
        {
            string resp = HttpActions.Post(ServiceURL.CompanyDelete + '/' + id, "");
        }

        public string Get(int id)
        {

            return HttpActions.Get(ServiceURL.GameGet + '/' + id);
        }

        public void Edit(GameModel model)
        {
            string resp = HttpActions.Post(ServiceURL.GameEdit, model.ToJObject().ToString());


            JObject json = JObject.Parse(resp);


            HttpActions.Post(ServiceURL.Game + "/delete/genres/" + json["id"], "");


            foreach (var id in model.GenreIds)
            {
                HttpActions.Post(ServiceURL.Game + "/set/genre/" + id + "?gameId=" + json["id"], "");
            }
        }
    }
}
