using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebaTecnica.Classes
{
    public class Response
    {
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsSuccess { get; set; } = false;
        public string RedirectTo { get; set; } = string.Empty;
        public object Object { get; set; } = null;
        public string JsonObject { get; set; } = string.Empty;
    }
}