using Common.Message.MiddlewareMessage;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data.SqlClient; // Import the SQL Server namespace
using System.Net;

namespace Api_InnerShop.MiddleWares
{
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (SqlException ex) 
            {
                await HandleExceptionAsync(context, MessageErrorInMiddleWares.DatabaseError + ex.Message);
            }
            catch (NullReferenceException ex)
            {
                await HandleExceptionAsync(context, MessageErrorInMiddleWares.NullReference + ex.Message);
            }
            catch (SystemException ex)
            {
                await HandleExceptionAsync(context, MessageErrorInMiddleWares.SystemError + ex.Message);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, MessageErrorInMiddleWares.UnexpectedError +  ex.Message);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, string errorMessage)
        {
            var code = HttpStatusCode.InternalServerError; // 500
            var result = JsonConvert.SerializeObject(new { error = errorMessage });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}