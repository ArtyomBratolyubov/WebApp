using System.Collections.Generic;
using System.Linq;
using DAO.Helpers;
using WebApp.Models;

namespace DAO.Services
{
    public class CountryService
    {

        public string All
        {
            get
            {
                string resp = HttpActions.Get(ServiceURL.CountryGetAll);

                return resp;
            }
        }



    }
}
