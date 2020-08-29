using HardSoft.MailService;
using PruebaTecnica.Classes;
using PruebaTecnica.Properties;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PruebaTecnica.Controllers
{
    public class AuthServiceController : Controller
    {
        internal const string UserCookie = "_uc";
        internal const string PasswordCookie = "_up";
        internal static int TokenResetPasswordTime = int.Parse(System.Configuration.ConfigurationManager.AppSettings["TokenResetPasswordTime"]);
        /// <summary>
        ///  Vista Principal, Encargada de redirigir al Login o al Dashboard
        /// </summary>
        /// <returns></returns>
        // GET: AuthService
        [HttpGet]
        [AllowAnonymous]
        public ActionResult SignIn()
        {

            if (this.Session["UserLoged"] != null)
            {
                return this.RedirectToAction("Index", "Home");
            }
            this.Rememberme();
            return View();
        }

        /// <summary>
        /// Encargado de realizar Autenticar al usuario
        /// aquí se obtienen:
        ///     Cooperativas, Menú, y el Periodo de trabajo del Usuario
        /// </summary>
        /// <param name="usuario"></param>
        /// <param name="contrasenia"></param>
        /// <returns>
        /// Un Json con un objeto de tipo Response
        /// </returns>
        [HttpPost]
        [AllowAnonymous]
        public JsonResult SignIn(string usuario, string contrasenia, bool? remember)
        {
            Response newResponse = new Response();
            try
            {
                using (var db = new PruebaTecnicaEntities())
                {
                    Usuario user = db.Usuarios.Where(u => u.UserName == usuario).FirstOrDefault();
                    if (User == null)
                    {
                        newResponse.Status = "error";
                        newResponse.IsSuccess = false;
                        newResponse.Message = "Verifique el usuario ingresado.";
                    }
                    else if (user != null)
                    {
                        if (user.Password == contrasenia)
                        {
                            FormsAuthentication.SignOut();
                            FormsAuthentication.SetAuthCookie(usuario, false);
                            this.Session["UserLoged"] = user.UserName;
                            this.Session["UserName"] = user.Nombre;
                            this.Session["Image"] = null;
                            this.Session["ActiveUser"] = user;
                            newResponse.IsSuccess = true;
                            //List<Menu> MenusAgrupados = new List<Menu>();
                            //_Cooperativas = new MenuUsuario().GetAgrupadoresByUser(user.UserName);
                            //this.Session["Agrupadores"] = _Cooperativas;
                            this.Rememberme(remember.HasValue ? remember.Value : false, usuario, contrasenia);
                        }
                        else
                        {
                            newResponse.Status = "error";
                            newResponse.IsSuccess = false;
                            newResponse.Message = "Usuario o Contraseña incorrecto, intente nuevamente";
                        }
                    }
                    else
                    {
                        newResponse.Status = "error";
                        newResponse.IsSuccess = false;
                        newResponse.Message = "El usuario se encuentra Deshabilitado, Comuniquese con el administrador del sistema";
                    }
                }
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
                return Json(newResponse);
            }
            return Json(newResponse);
        }

        /// <summary>
        /// Acción utilizada para deslogear a un usuario.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public ActionResult SignOut()
        {
            FormsAuthentication.SignOut();
            this.Session.RemoveAll();
            return this.RedirectToAction("SignIn");
        }

        /// <summary>
        /// Recuperar Contraseña, envia un email para recuperar contraseña
        /// </summary>
        /// <param name="email"></param>
        /// <returns>
        /// Un Json con un objeto de tipo Models_SRGL_Application.Response
        /// </returns>

        [HttpPost]
        [AllowAnonymous]
        public JsonResult ForgotPassword(string email)
        {
            Response newResponse = new Response();
            try
            {
                using (var db = new PruebaTecnicaEntities())
                {
                    Usuario user = db.Usuarios.Where(u => u.Correo == email).FirstOrDefault();
                    if (user != null && !string.IsNullOrEmpty(user.Correo))
                    {
                        this.Session["UserEmailSend"] = user.UserName;
                        string token = DateTime.Now.ToString() + "|" + user.UserName;
                        user.Token = token;
                        if (db.SaveChanges() > 0)
                        {
                            string respuesta = EnviarCorreo(user.Correo, this.Url.Action("ResetPassword", "AuthService", new { token = user.Token }, this.Request.Url.Scheme));
                            if (!string.IsNullOrEmpty(respuesta))
                            {
                                newResponse.Status = "success";
                                newResponse.IsSuccess = true;
                                newResponse.Message = respuesta.ToString();
                            }
                            else
                            {
                                newResponse.Status = "error";
                                newResponse.IsSuccess = false;
                                newResponse.Message = "Ocurrió un error al tratar de enviar el correo. Intente nuevamente mas tarde, o contacte a su asesor de sistemas";
                            }
                        }
                        else
                        {
                            newResponse.Status = "error";
                            newResponse.IsSuccess = false;
                            newResponse.Message = "Ocurrió un error al tratar asociar un token al correo. " + user.Correo;
                        }
                    }
                    else
                    {
                        newResponse.Status = "error";
                        newResponse.IsSuccess = false;
                        newResponse.Message = "No existe un correo asociado a este usuario.";
                    }
                }
                return Json(newResponse);
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error inesperado, por favor intente mas tarde";
                return Json(newResponse);
            }
        }

        /// <summary>
        /// realiza envio de correos de forma sincrona
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>

        private string EnviarCorreo(string email, string link)
        {
            try
            {
                string resp = string.Empty;
                string smtpServer = System.Configuration.ConfigurationManager.AppSettings["MailHost"];
                int Port = int.Parse(System.Configuration.ConfigurationManager.AppSettings["MailPort"]);
                string smtpUser = System.Configuration.ConfigurationManager.AppSettings["MailUserName"];
                string smtpPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];
                string subject = "Cambio de contraseña - Prueba Tecnica";
                string body = Resources.forgot_password;
                body = body.Replace("[Usuario]", this.Session["UserEmailSend"].ToString());
                body = body.Replace("[Link]", link);
                body = body.Replace("[TokenResetPasswordTime]", System.Configuration.ConfigurationManager.AppSettings["TokenResetPasswordTime"]);
                //body = body.Replace("[MailTemplateLogo]", MailHelper.MailTemplateLogo);
                string from = System.Configuration.ConfigurationManager.AppSettings["MailUserName"];
                string toMailsAddress = email;
                List<string> Adjuntos = new List<string>();
                MailManager mailManager = new MailManager(smtpServer, Port, smtpUser, smtpPassword, subject, body, from, toMailsAddress, true);
                return resp = mailManager.Send();
            }
            catch (Exception ex)
            {
                return "ocurrió un error inesperado al enviar el correo.";
            }
        }

        [AuthorizeUser]
        public ActionResult AccessDenied()
        {
            return View();
        }

        [AuthorizeUser]
        public ActionResult NotFound()
        {
            return View();
        }

        void Rememberme(bool rememberPassword, string username, string password)
        {
            if (rememberPassword && !(string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(password)))
            {
                this.Response.Cookies[UserCookie].Expires = DateTime.Now.AddDays(10);
                this.Response.Cookies[PasswordCookie].Expires = DateTime.Now.AddDays(10);
                this.Response.Cookies[UserCookie].Value = username.Trim();
                this.Response.Cookies[PasswordCookie].Value = password.Trim();
            }
            else
            {
                this.Response.Cookies[UserCookie].Expires = DateTime.Now.AddDays(-1);
                this.Response.Cookies[PasswordCookie].Expires = DateTime.Now.AddDays(-1);
                this.Response.Cookies[UserCookie].Value = null;
                this.Response.Cookies[PasswordCookie].Value = null;
            }
        }

        void Rememberme()
        {
            bool isChecked = (this.Request.Cookies[UserCookie] != null && this.Request.Cookies[PasswordCookie] != null);
            if (isChecked)
            {
                this.ViewData["usuario"] = this.Request.Cookies[UserCookie].Value.Trim();
                this.ViewData["contrasenia"] = this.Request.Cookies[PasswordCookie].Value.Trim();
                this.ViewData["remember"] = isChecked;
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult ResetPassword(string token)
        {
            try
            {
                string Token = token.Trim();
                string Tiempo = Token.Split('|')[0];
                string usuario = Token.Split('|')[1];
                this.ViewData["TokenExpirado"] = DateTime.Now.Subtract(Convert.ToDateTime(Tiempo)).TotalMinutes > TokenResetPasswordTime ? true : false;
            }
            catch
            {
                this.ViewData["TokenExpirado"] = true;
            }
            return this.View();
        }

        [HttpPost]
        [AllowAnonymous]
        public JsonResult ResetPassword(string token, string Contrasenia, string ConfirmarContrasenia)
        {
            Response newResponse = new Response();
            try
            {
                if (Contrasenia.Equals(ConfirmarContrasenia))
                {
                    string Token = token.Trim();
                    string Tiempo = Token.Split('|')[0];
                    string usuario = Token.Split('|')[1];
                    if (DateTime.Now.Subtract(Convert.ToDateTime(Tiempo)).TotalMinutes > TokenResetPasswordTime)
                    {
                        newResponse.Status = "error";
                        newResponse.IsSuccess = false;
                        newResponse.Message = "El token utilizado ha Expirado.";
                    }
                    else
                    {
                        //Usuario User = new UsuarioDal().GetUsuarios(usuario).FirstOrDefault();
                        //if (User != null && User.Token.Equals(token))
                        //{
                        //    MembershipUser memberShipUser = Membership.GetUser(User.Login);
                        //    string contraseniaAnterior = User.Contrasenia;
                        //    User.CambiarContrasenia = false;
                        //    User.Contrasenia = Contrasenia;
                        //    User.ConfirmarContrasenia = ConfirmarContrasenia;
                        //    User.Token = null;
                        //    if (new UsuarioDal().GuardarUsuario(User))
                        //    {
                        //        if (memberShipUser.ChangePassword(memberShipUser.ResetPassword(), User.ConfirmarContrasenia))
                        //        {
                        //            newResponse.Status = "success";
                        //            newResponse.IsSuccess = true;
                        //            newResponse.Message = "Se ha modificado la contraseña correctamente";
                        //            newResponse.RedirectTo = "";
                        //        }
                        //        else
                        //        {
                        //            User.Contrasenia = contraseniaAnterior;
                        //            User.CambiarContrasenia = true;
                        //            User.ConfirmarContrasenia = contraseniaAnterior;
                        //            User.Token = token;
                        //            if (!new UsuarioDal().GuardarUsuario(User))
                        //            {
                        //                newResponse.Status = "error";
                        //                newResponse.IsSuccess = false;
                        //                newResponse.Message = "Ha ocurrido un problema, Genere un nuevo token para cambiar su contraseña";
                        //            }
                        //        }
                        //    }
                        //    else
                        //    {
                        //        newResponse.Status = "error";
                        //        newResponse.IsSuccess = false;
                        //        newResponse.Message = "Ha ocurrido un error inesperado, por favor intente mas tarde";
                        //    }
                        //}
                        //else
                        //{
                        //    newResponse.Status = "error";
                        //    newResponse.IsSuccess = false;
                        //    newResponse.Message = "El token no es valido o ha expirado.";
                        //}
                    }
                }
                else
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "los campos contraseña y Verificar contraseña no son iguales.";
                }

                return Json(newResponse);
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error inesperado, por favor intente mas tarde";
                return Json(newResponse);
            }
        }
    }
}