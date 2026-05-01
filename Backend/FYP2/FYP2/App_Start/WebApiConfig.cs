using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace FYP2
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // 🔥 FIX: Ignore self referencing loop
            config.Formatters.JsonFormatter.SerializerSettings
                  .ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

            config.Formatters.JsonFormatter.SerializerSettings
                  .PreserveReferencesHandling = PreserveReferencesHandling.None;

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

    }
}
