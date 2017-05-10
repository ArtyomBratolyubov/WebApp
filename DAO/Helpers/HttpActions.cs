using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Helpers
{
    public static class HttpActions
    {
        public static string Get(string url)
        {
            try
            {
                WebRequest request = WebRequest.Create(url);

                request.Credentials = CredentialCache.DefaultCredentials;

                WebResponse response = request.GetResponse();


                Stream dataStream = response.GetResponseStream();

                StreamReader reader = new StreamReader(dataStream);

                string responseFromServer = reader.ReadToEnd();

                reader.Close();
                response.Close();

                return responseFromServer;
                //}
                //    catch (System.Net.WebException ex)
                //    {
                //        return "";
            }
            catch (System.Net.WebException ex)
            {
                return "{}";
            }
        }



        public static string Post(string url, string jsonContent)
        {
            try
            {
                WebRequest request = WebRequest.Create(url);

                request.Method = "POST";

                string postData = jsonContent;
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);

                request.ContentType = "application/json";

                request.ContentLength = byteArray.Length;

                Stream dataStream = request.GetRequestStream();

                dataStream.Write(byteArray, 0, byteArray.Length);

                dataStream.Close();

                WebResponse response = request.GetResponse();

                dataStream = response.GetResponseStream();

                StreamReader reader = new StreamReader(dataStream);

                string responseFromServer = reader.ReadToEnd();

                reader.Close();
                dataStream.Close();
                response.Close();

                return responseFromServer;
            }
            catch (System.Net.WebException ex)
            {
                return "{}";
            }
        }


    }
}