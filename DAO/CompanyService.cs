using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;
using WebApp.Models;

namespace DAO
{
    public class CompanyService
    {
        private static List<CompanyModel> _data = new List<CompanyModel>();

        public IEnumerable<CompanyModel> All => _data;

        public void Add(CompanyModel model)
        {
            if (_data.Count > 0)
                model.Id = _data.Last().Id + 1;
            else
            {
                model.Id = 1;
            }
            _data.Add(model);
        }


        public void Remove(int id)
        {
            _data.Remove(_data.FirstOrDefault(m => m.Id == id));
        }

        public CompanyModel Get(int id)
        {
            return _data.FirstOrDefault(m => m.Id == id);
        }

        public void Edit(CompanyModel model)
        {
            var obj = _data.FirstOrDefault(m => m.Id == model.Id);

            obj.Name = model.Name;

            obj.Description = model.Description;
        }
    }
}
