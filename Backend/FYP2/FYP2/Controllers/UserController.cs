using FYP2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FYP2.Controllers
{
    public class UserController : ApiController
    {

        Teacher_Evaluation_SystemEntities2 db = new Teacher_Evaluation_SystemEntities2();
        //[HttpGet]
        //public HttpResponseMessage GetAllUsers()
        //{
        //    try
        //    {
        //        var users = db.Logins.ToList();
        //        return Request.CreateResponse(HttpStatusCode.OK, users);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.ToString());
        //    }
        //}

        [HttpGet]
        public HttpResponseMessage GetAllUsers()
        {
            try
            {
                var users = db.Log_In.ToList();
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.ToString());
            }
        }

        //[Route("api/[LogIn]")]
        [HttpGet]
        public HttpResponseMessage LoginUser(string user, string pass)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Userid and password are required");
                }

                var res = db.Log_In.FirstOrDefault(u => u.User_id.Trim() == user.Trim() && u.User_password.Trim() == pass.Trim());

                if (res== null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid userid or password");
                }

                int sem = 0;
                string designation = ""; // New variable
                if (res.User_type.Trim().Equals("student", StringComparison.OrdinalIgnoreCase))
                {
                    string session = db.STMTRs
                                       .Where(s => s.Reg_No.Trim() == res.User_id.Trim())
                                       .Select(s => s.Semester_no)
                                       .FirstOrDefault();

                    if (!string.IsNullOrEmpty(session) && session.Length >= 4)
                    {
                        int eyear = int.Parse(session.Substring(0, 4));
                        int currentYear = DateTime.Now.Year;
                        int currentMonth = DateTime.Now.Month;

                        // Actual calculation
                        int calculatedSem = (currentYear - eyear) * 2;
                        if (currentMonth >= 9)
                        {
                            calculatedSem += 1;
                        }

                        // Aapki requirement: 2 semesters kam dikhaye
                        sem = calculatedSem - 2;

                        // Safety check: semester 0 ya negative na ho jaye
                        if (sem < 1) sem = 1;
                    }
                }
                else if (res.User_type.Trim().Equals("teacher", StringComparison.OrdinalIgnoreCase))
                {
                    // Fetch designation for teachers
                    designation = db.EMPMTRs
                                    .Where(e => e.Emp_no.Trim() == res.User_id.Trim())
                                    .Select(e => e.Designation)
                                    .FirstOrDefault() ?? "";
                }
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    message = "Login successful",
                    userid = res.User_id.Trim(),
                    userType = res.User_type.Trim(),
                    semester = sem,
                    designation = designation.Trim() // Send this to frontend
            });
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error: " + ex.Message);
            }
        }

        [HttpPost]
        public HttpResponseMessage LogoutUser(string userid)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userid))
                {
                    return Request.CreateErrorResponse(
                        HttpStatusCode.BadRequest,
                        "Userid required"
                    );
                }

                var user = db.Log_In.FirstOrDefault(u => u.User_id == userid);

                if (user == null)
                {
                    return Request.CreateErrorResponse(
                        HttpStatusCode.NotFound,
                        "User not found"
                    );
                }

                return Request.CreateResponse(
                    HttpStatusCode.OK,
                    "User logged out successfully"
                );
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.InternalServerError,
                    ex.ToString()
                );
            }

            //    [HttpGet]
            //    public HttpResponseMessage LoginUser(string userid, string password)
            //    {
            //        try
            //        {
            //            if (string.IsNullOrWhiteSpace(userid) || string.IsNullOrWhiteSpace(password))
            //            {
            //                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Userid and password are required");
            //            }

            //            var user = db.Logins.FirstOrDefault(u => u.User_id.Trim() == userid.Trim() && u.User_password.Trim() == password.Trim());

            //            if (user == null)
            //            {
            //                return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid userid or password");
            //            }

            //            int sem = 0;

            //            if (user.User_type.Trim().Equals("student", StringComparison.OrdinalIgnoreCase))
            //            {
            //                string semesterStr = db.Students.Where(s => s.Reg_no == user.User_id).Select(s => s.Semester).FirstOrDefault();
            //                int.TryParse(semesterStr, out sem);
            //            }
            //            return Request.CreateResponse(HttpStatusCode.OK, new { message = "Login successful", userid = user.User_id, userType = user.User_type.Trim(), sem });
            //        }
            //        catch (Exception ex)
            //        {
            //            return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.ToString());
            //        }
            //    }


            //    [HttpPost]
            //    public HttpResponseMessage LogoutUser(string userid)
            //    {
            //        try
            //        {
            //            if (string.IsNullOrWhiteSpace(userid))
            //            {
            //                return Request.CreateErrorResponse(
            //                    HttpStatusCode.BadRequest,
            //                    "Userid required"
            //                );
            //            }

            //            var user = db.Logins.FirstOrDefault(u => u.User_id == userid);

            //            if (user == null)
            //            {
            //                return Request.CreateErrorResponse(
            //                    HttpStatusCode.NotFound,
            //                    "User not found"
            //                );
            //            }

            //            return Request.CreateResponse(
            //                HttpStatusCode.OK,
            //                "User logged out successfully"
            //            );
            //        }
            //        catch (Exception ex)
            //        {
            //            return Request.CreateErrorResponse(
            //                HttpStatusCode.InternalServerError,
            //                ex.ToString()
            //            );
            //        }
            //    }
        }
    }

}