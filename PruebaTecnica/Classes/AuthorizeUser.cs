using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace PruebaTecnica.Classes
{
    /// <summary>
    /// Verifica que exista una sesión activa, de lo contrario redirige al inicio de sesión.
    /// </summary>
    public class AuthorizeUser : ActionFilterAttribute, System.Web.Mvc.IActionFilter
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.Session["UserLoged"] == null || string.IsNullOrWhiteSpace(HttpContext.Current.Session["UserLoged"].ToString()))
            {
                filterContext.Result = new System.Web.Mvc.RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary
                {
                    {"Controller", "AuthService" },
                    {"Action",  "SignIn"}
                });
            }
            base.OnActionExecuting(filterContext);
        }

    }
}