using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.User
{
    public class ChangePasswordUserRequestDTO
    {
        [Required(ErrorMessage = "Old password is required")]
        public string oldPassword { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Repeat password is required")]
        public string rePassword { get; set; }
    }
}
