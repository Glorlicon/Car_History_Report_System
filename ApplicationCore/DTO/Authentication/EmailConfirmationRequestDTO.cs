﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Authentication
{
    public class EmailConfirmationRequestDTO
    {
        public string Token { get; set; }
        public string Email { get; set; }
    }
}
