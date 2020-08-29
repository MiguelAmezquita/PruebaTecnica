using PruebaTecnica.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PruebaTecnica.Controllers
{
    public class ClientesController : Controller
    {
        PruebaTecnicaEntities db = new PruebaTecnicaEntities();
        // GET: Producto
        [AuthorizeUser]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetCliente(int ID)
        {
            Response newResponse = new Response();
            Cliente cliente = db.Clientes.Where(x => x.IDCliente == ID).FirstOrDefault();
            if (cliente == null)
            {
                newResponse.Status = "error";
                newResponse.IsSuccess = false;
                newResponse.Message = "El identificador seleccionado no pertenece a ningun cliente registrado";
                return Json(newResponse, JsonRequestBehavior.AllowGet);
            }
            else
            {
                newResponse.Status = "success";
                newResponse.IsSuccess = true;
                newResponse.Object = cliente;
            }
            return Json(newResponse, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetClientes()
        {
            List<Cliente> Clientes = db.Clientes.OrderBy(x => x.IDCliente).ToList();
            return Json(new { data = Clientes }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult Create(Cliente cliente)
        {
            Response newResponse = new Response();
            try
            {
                if (cliente != null && (string.IsNullOrEmpty(cliente.Codigo) || string.IsNullOrEmpty(cliente.Nombres)))
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "Debe ingresar un Código y El un nombre por lo menos";
                    return Json(newResponse);
                }


                Producto entity = db.Productos.Where(p => p.Codigo == cliente.Codigo).FirstOrDefault();
                if (entity != null)
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "ya existe un cliente registrado con ese codigo";
                    return Json(newResponse);
                }

                db.Clientes.Add(cliente);
                if (db.SaveChanges() > 0)
                {
                    newResponse.Status = "success";
                    newResponse.IsSuccess = true;
                    newResponse.Message = "Cliente Agregado Exitosamente";
                }
                else
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "No se pudo crear el cliente.";
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
        public JsonResult Update(Cliente cliente)
        {
            Response newResponse = new Response();
            try
            {
                Cliente entity = db.Clientes.Where(p => p.IDCliente == cliente.IDCliente).FirstOrDefault();
                if (entity == null)
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "No se ha encontrado ningún cliente con ese identificador";
                    return Json(newResponse);
                }

                entity.Nombres = cliente.Nombres;
                entity.Apellidos = cliente.Apellidos;
                entity.Codigo = cliente.Codigo;
                entity.Direccion = cliente.Direccion;
                db.Entry(entity).State = System.Data.EntityState.Modified;
                if (db.SaveChanges() > 0)
                {
                    newResponse.Status = "success";
                    newResponse.IsSuccess = true;
                    newResponse.Message = "Cliente Editado Exitosamente";
                }
                else
                {
                    newResponse.Status = "error";
                    newResponse.IsSuccess = false;
                    newResponse.Message = "No se pudo editar el cliente seleccionado";
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