using System.Collections.Generic;
using System.Linq;
using DAO.Helpers;
using Models;
using Newtonsoft.Json.Linq;

namespace DAO.Services
{
    public class CompanyService
    {

        public string All
        {
            get
            {
                var resp = HttpActions.Get(ServiceURL.CompanyGetAll);
                return resp;
            }
        }

        public void Add(CompanyModel model)
        {
            string resp = HttpActions.Post(ServiceURL.CompanyAdd, model.ToJObject().ToString());
        }


        public void Remove(int id)
        {
            string resp = HttpActions.Post(ServiceURL.CompanyDelete + '/' + id, "");
        }

        public string Get(int id)
        {

            return HttpActions.Get(ServiceURL.CompanyGet + '/' + id);
        }

        public void Edit(CompanyModel model)
        {
            string resp = HttpActions.Post(ServiceURL.CompanyEdit, model.ToJObject().ToString());
        }
    }
}
