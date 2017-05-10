using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Newtonsoft.Json.Linq;

namespace WebApp.Helpers
{
    public static class ImagesHelper
    {
        public static string SaveImage(string base64, string path)
        {
            base64 = Uri.UnescapeDataString(base64);

            string ext = GetExtension(base64);

            var bytes = Convert.FromBase64String(base64.Split(',')[1]);

            string guid = Guid.NewGuid().ToString();

            string name = guid + ext;

            string dir = path + @"Content\Images\All\" + name;

            using (var imageFile = new FileStream(dir, FileMode.Create))
            {
                imageFile.Write(bytes, 0, bytes.Length);
                imageFile.Flush();
            }

            return name;
        }

        public static void DeleteImage(string src, string path)
        {
            if (src.Contains("noimagefound")) 
                return;

            if (File.Exists(path + src))
            {
                File.Delete(path + src);
            }
        }

        public static string GetExtension(string str)
        {
            StringBuilder ext = new StringBuilder();
            bool flag = false;
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == ';')
                    break;

                if (flag && str[i] != ';')
                    ext.Append(str[i]);

                if (str[i] == '/')
                    flag = true;
            }
            ext.Insert(0, '.');
            return ext.ToString();
        }
    }
}