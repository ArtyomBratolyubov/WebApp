using Newtonsoft.Json.Linq;

namespace Models
{
    public class CompanyModel
    {
        public CompanyModel()
        {
            Country = new CountryModel();
        }

        public int? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public CountryModel Country { get; set; }



        public JObject ToJObject()
        {
            dynamic json = new JObject();
            json.id = Id;
            json.companyName = Name;
            json.companyDescription = Description ?? "";
            json.url = ImageUrl;
            json.country = new JObject();
            json.country.id = Country.Id;

            return json;
        }

    }
}