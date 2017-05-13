using System.Collections.Generic;
using System.Linq;
using DAO.Helpers;
using WebApp.Models;

namespace DAO.Services
{
    public class GenreService
    {

        public string All => HttpActions.Get(ServiceURL.GenreGetAll);

        public string Add(GenreModel model)
        {
            string resp = HttpActions.Post(ServiceURL.GenreAdd, model.ToJObject().ToString());

            return resp;
        }


        public void Remove(int id)
        {
            string resp = HttpActions.Post(ServiceURL.GenreDelete + '/' + id, "");
        }

        public string Get(int id)
        {
            return HttpActions.Get(ServiceURL.GenreGet + '/' + id);
        }

        public string Edit(GenreModel model)
        {
            string resp = HttpActions.Post(ServiceURL.GenreEdit, model.ToJObject().ToString());

            return resp;
        }
    }
}
