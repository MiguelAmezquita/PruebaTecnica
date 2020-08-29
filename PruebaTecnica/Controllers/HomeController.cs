using PruebaTecnica.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PruebaTecnica.Controllers
{
    public class HomeController : Controller
    {
        [AuthorizeUser]
        public ActionResult Index()
        {
            return View();
        }
    }
}