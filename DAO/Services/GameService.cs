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
                var resp = HttpActions.Get(ServiceURL.CompanyGetAll);
                return resp;
            }
        }

        public void Add(GameModel model)
        {
            string resp = HttpActions.Post(ServiceURL.GameAdd, model.ToJObject().ToString());
        }


        public void Remove(int id)
        {
            string resp = HttpActions.Post(ServiceURL.CompanyDelete + '/' + id, "");
        }

        public string Get(int id)
        {

            return HttpActions.Get(ServiceURL.CompanyGet + '/' + id);
        }

        public void Edit(GameModel model)
        {
            string resp = HttpActions.Post(ServiceURL.CompanyEdit, model.ToJObject().ToString());
        }
    }
}
