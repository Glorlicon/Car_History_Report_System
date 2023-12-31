﻿using Application.DTO.DataProvider;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.User
{
    public class CreateUserRequestDTO
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string PhoneNumber { get; set; }
        public string LastName { get; set; }
        public string? Address { get; set; }
        public int MaxReportNumber { get; set; } = 0;
        public Role Role { get; set; } = Role.User;
        public int? DataProviderId { get; set; }
        public DataProviderCreateRequestDTO? DataProvider { get; set; }
    }
}
