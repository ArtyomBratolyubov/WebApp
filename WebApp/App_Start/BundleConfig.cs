using System.Web;
using System.Web.Optimization;

namespace WebApp
{
    public class BundleConfig
    {

        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                                  "~/Scripts/angular.js",
                                  "~/Scripts/angular-route.js",
                                  "~/Scripts/angular-touch.js",
                                  "~/Scripts/angular-animate.js",
                                  "~/Scripts/angular-ui/ui-bootstrap.js",
                                  "~/Scripts/checklist-model.js",
                                  "~/Scripts/Chart.js",
                                  "~/Scripts/angular-chart.js",
                                  "~/js/main.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.min.css",
                "~/Content/site.css"
                ));
        }
    }
}
