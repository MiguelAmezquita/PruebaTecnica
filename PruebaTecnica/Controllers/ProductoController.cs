using PruebaTecnica.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PruebaTecnica.Controllers
{
    public class ProductoController : Controller
    {
        PruebaTecnicaEntities db = new PruebaTecnicaEntities();
        // GET: Producto
        [AuthorizeUser]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetProducto(int ID)
        {
            Response newResponse = new Response();
            Producto Producto = db.Productos.Where(x => x.IDProducto == ID).FirstOrDefault();
            if (Producto == null)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "Debe ingresar un Código y producto Valido";
                return Json(newResponse, JsonRequestBehavior.AllowGet);
            }
            else
            {
                newResponse.Status = "success";
                newResponse.IsSuccess = true;
                newResponse.Object = Producto;
            }
            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProductos()
        {
            List<Producto> Productos = db.Productos.OrderBy(x => x.IDProducto).ToList();
            return Json(new { data = Productos }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult Create(Producto producto)
        {
            Response newResponse = new Response();
            try
            {
                if (producto != null && (string.IsNullOrEmpty(producto.Codigo) || string.IsNullOrEmpty(producto.Nombre)))
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "Debe ingresar un Código y producto Valido";
                    return Json(newResponse);
                }


                Producto entity = db.Productos.Where(p => p.IDProducto == producto.IDProducto).FirstOrDefault();
                if (entity != null)
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "ya existe un articulo con ese identificador";
                    return Json(newResponse);
                }

                db.Productos.Add(producto);
                if (db.SaveChanges() > 0)
                {
                    newResponse.Status = "success";
                    newResponse.IsSuccess = true;
                    newResponse.Message = "Articulo Agregado Exitosamente";
                }
                else
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "No se pudo editar el articulo No. " + producto.IDProducto;
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

        [HttpPost]
        public JsonResult Update(Producto producto)
        {
            Response newResponse = new Response();
            try
            {
                Producto entity = db.Productos.Where(p => p.IDProducto == producto.IDProducto).FirstOrDefault();
                if (entity == null)
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "No se ha encontrado ningún articulo con ese identificador";
                    return Json(newResponse);
                }
                entity.Nombre = producto.Nombre;
                entity.Codigo = producto.Codigo;
                entity.PrecioCompra = producto.PrecioCompra;
                entity.PrecioVenta = producto.PrecioVenta;
                db.Entry(entity).State = System.Data.EntityState.Modified;
                if (db.SaveChanges() > 0)
                {
                    newResponse.Status = "success";
                    newResponse.IsSuccess = true;
                    newResponse.Message = "Articulo Editado Exitosamente";
                }
                else
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "No se pudo editar el articulo No. " + producto.IDProducto;
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

        [HttpPost]
        public JsonResult Borrar(int ID)
        {
            Response newResponse = new Response();
            try
            {
                if (ID < 1)
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "Ha ocurrido un error Inesperado, intente mas tarde";
                }
                else
                {
                    Producto entity = db.Productos.Where(p => p.IDProducto == ID).FirstOrDefault();
                    if (entity != null)
                    {
                        db.Productos.Remove(entity);
                        if (db.SaveChanges() > 0)
                        {
                            newResponse.Status = "success";
                            newResponse.IsSuccess = true;
                            newResponse.Message = "Articulo Eliminado Exitosamente";
                        }
                        else
                        {
                            newResponse.Status = "error";
                            newResponse.IsSuccess = false;
                            newResponse.Message = "No se pudo eliminar el articulo No. " + ID;
                        }
                    }
                    else
                    {
                        newResponse.Status = "error";
                        newResponse.IsSuccess = false;
                        newResponse.Message = "No se encontró ningún articulo con ese Identificador";
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
    }
}