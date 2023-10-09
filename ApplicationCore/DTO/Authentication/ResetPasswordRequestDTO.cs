using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Authentication
{
    public class ResetPasswordRequestDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }
        [Required(ErrorMessage = "New password is required")]
        [DataType(DataType.Password)]
        public string newPassword { get; set; }
        [Required(ErrorMessage = "New Reapeat password is required")]
        [DataType(DataType.Password)]
        public string newRepeatPassword { get; set; }
    }
}
