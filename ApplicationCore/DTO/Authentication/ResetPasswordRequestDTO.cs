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
        public string Token { get; set; }

        public string Email { get; set; }
    }
}
