using Newtonsoft.Json;
using PruebaTecnica.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PruebaTecnica.Controllers
{
    public class VentasController : Controller
    {

        PruebaTecnicaEntities db = new PruebaTecnicaEntities();
        public Cliente Cliente
        {
            get => (Cliente)this.Session["_cliente"] ?? null;
            set => this.Session["_cliente"] = value;
        }
        public Factura Factura
        {
            get => (Factura)this.Session["_factura"] ?? null;
            set => this.Session["_factura"] = value;
        }
        public decimal TotalFactura
        {
            get => DetalleFactura != null ? DetalleFactura.Sum(e => e.Total) : 0;
        }
        public List<Detalle_Factura> DetalleFactura
        {
            get => (List<Detalle_Factura>)this.Session["_detalleFactura"] ?? null;
            set => this.Session["_detalleFactura"] = value;
        }

        // GET: Ventas
        [AuthorizeUser]
        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// Obtiene el emcabezado de la factura
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetEncabezadoFactura()
        {
            return Json(new { data = Factura }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Obtiene el detalle de la factura
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetDetalleFactura()
        {
            return Json(new { data = DetalleFactura }, JsonRequestBehavior.AllowGet);
        }

        #region Factura

        /// <summary>
        /// recibe como parametro un codigo de cliente, para asociarlo a la venta temporal
        /// </summary>
        /// <param name="Codigo"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AgregarCliente(string Codigo)
        {
            Response newResponse = new Response();
            try
            {
                Cliente entity = db.Clientes.Where(p => p.Codigo.Trim().ToUpper() == Codigo.Trim().ToUpper()).FirstOrDefault();
                if (entity == null)
                {
                    newResponse.Status = "error";
                    newResponse.Message = "No se encuentra ningún cliente asociado a este código.";
                    newResponse.IsSuccess = false;
                    return Json(newResponse, JsonRequestBehavior.AllowGet);
                }
                Cliente = entity;
                Cliente.Facturas = null;
                newResponse.Status = "success";
                newResponse.IsSuccess = true;
                newResponse.Object = Cliente;
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
            }

            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// Obtiene todos los datos relacionados ala venta temporal, esto le permite cambiar de pagina sin perder el estado de la venta temporal
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult VetaEnProceso()
        {
            Response newResponse = new Response();
            try
            {
                newResponse.Status = "success";
                newResponse.IsSuccess = true;
                newResponse.Object = new { Cliente, Factura, DetalleFactura, TotalFactura };
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
                newResponse.Object = null;
            }

            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }

        #endregion
        #region DetalleFactura  
        /// <summary>
        /// Obtiene el detalle del articulo seleccionado del grid del de talle de la factura.
        /// </summary>
        /// <param name="IDDetalleVenta"></param>
        /// <param name="Codigo"></param>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetArticuloFactura(int IDDetalleVenta, string Codigo)
        {
            Response newResponse = new Response();
            Detalle_Factura Articulo = DetalleFactura != null ? DetalleFactura.Find(d => IDDetalleVenta > 0 ? d.IDDetalleFactura == IDDetalleVenta : d.Producto.Codigo == Codigo) : null;
            if (Articulo != null)
            {
                newResponse.Status = "success";
                newResponse.IsSuccess = true;
                newResponse.Object = Articulo;
            }
            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Utilizado agregar un producto al detalle, recibe como parametro el codigo del articulo y una cantidad por defecto 1
        /// </summary>
        /// <param name="Codigo"></param>
        /// <param name="Cantidad"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AgregarProducto(string Codigo, int Cantidad)
        {
            Response newResponse = new Response();
            try
            {
                if (DetalleFactura == null)
                    DetalleFactura = new List<Detalle_Factura>();

                Producto entity = db.Productos.Where(p => p.Codigo.ToUpper() == Codigo.ToUpper()).FirstOrDefault();
                if (DetalleFactura.Exists(d => d.Producto.Codigo.ToUpper() == Codigo.ToUpper()))
                {
                    DetalleFactura.Find(d => d.Producto.Codigo.ToUpper() == Codigo.ToUpper()).Cantidad += Cantidad;
                }
                else
                {
                    Detalle_Factura detalle = new Detalle_Factura();
                    detalle.Cantidad = Cantidad;
                    detalle.Producto = entity;
                    DetalleFactura.Add(detalle);
                }
                this.Session["_detalleFactura"] = DetalleFactura;
                newResponse.Status = "success";
                newResponse.IsSuccess = true;
                newResponse.Object = DetalleFactura;
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
            }

            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="IDDetalleFactura"></param>
        /// <param name="Codigo"></param>
        /// <param name="Cantidad"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult EditarProducto(int IDDetalleFactura, string Codigo, int Cantidad)
        {
            Response newResponse = new Response();
            try
            {
                if (DetalleFactura.Exists(d => d.IDDetalleFactura == IDDetalleFactura && d.Producto.Codigo.ToUpper() == Codigo.ToUpper()))
                {
                    DetalleFactura.Find(d => d.Producto.Codigo.ToUpper() == Codigo.ToUpper()).Cantidad = Cantidad;
                    newResponse.Status = "success";
                    newResponse.IsSuccess = true;
                }
                else
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "Ocurrió un problema al modificar el articulo, intente mas tarde.";
                }
                newResponse.Object = DetalleFactura;
            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
            }

            return Json(newResponse, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult Borrar(int IDDetalleVenta, string Codigo)
        {
            Response newResponse = new Response();
            try
            {
                if (IDDetalleVenta == 0)
                {
                    Detalle_Factura detalle = DetalleFactura.Find(i => i.Producto.Codigo == Codigo);
                    if (DetalleFactura.Remove(detalle))
                    {
                        newResponse.Status = "success";
                        newResponse.IsSuccess = true;
                        newResponse.Message = "Se removió el articulo con el código: " + Codigo + " Exitosamente.";
                    }
                }
                else
                {
                    if (DetalleFactura.Remove(DetalleFactura.Find(i => i.Producto.Codigo == Codigo)))
                    {
                        newResponse.Status = "success";
                        newResponse.IsSuccess = true;
                        newResponse.Message = "Se removió el articulo con el código: " + Codigo + " Exitosamente.";
                    }
                }

            }
            catch (Exception ex)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
            }
            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region AccionesPagina
        /// <summary>
        /// Permite crear una venta nueva, limpiando las variables temporales de la sección de la venta
        /// </summary>
        /// <returns></returns>
        public ActionResult NuevaVenta()
        {
            this.Cliente = null;
            this.Factura = null;
            this.DetalleFactura = null;
            return RedirectToAction("Index");
        }

        /// <summary>
        /// Se utiliza para aplicar las facturas que se encuentran en la venta temporal, hasta en este momento se envía a base de datos
        /// </summary>
        /// <returns>
        /// retorna al Index de la pagina
        /// </returns>
        public ActionResult AplicarFactura()
        {

            if (DetalleFactura != null)
            {
                Usuario user = this.Session["ActiveUser"] != null ? (Usuario)this.Session["ActiveUser"] : db.Usuarios.Where(u => u.UserName == this.Session["UserLoged"].ToString()).FirstOrDefault();
                Factura factus = new Factura();
                factus.NumeroFactura = "1";
                factus.Estado = 1;
                factus.FechaEmision = DateTime.Now;
                factus.FechaAnulacion = null;
                factus.Monto = TotalFactura;
                factus.Usuario = db.Usuarios.Find(user.IDUsuario);
                factus.Cliente = db.Clientes.Find(Cliente.IDCliente);
                db.Facturas.Add(factus);
                DetalleFactura.ForEach(d =>
                {
                    db.Detalle_Factura.Add(new Detalle_Factura
                    {
                        Factura = factus,
                        Cantidad = d.Cantidad,
                        Producto = db.Productos.Find(d.Producto.IDProducto),
                    });
                });
                if (db.SaveChanges() > 0)
                {
                    return RedirectToAction("NuevaVenta");
                };
            }

            return RedirectToAction("Index");

        }

        #endregion
    }
}