﻿using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.User
{
    public class UpdateUserRequestDTO
    {
        public string FirstName { get; set; }
        public string PhoneNumber { get; set; }
        public string LastName { get; set; }
        public string? Address { get; set; }
        public int MaxReportNumber { get; set; } = 0;
        public Role Role { get; set; } = Role.User;
        public int? DataProviderId { get; set; }
        public string? AvatarImageLink { get; set; }

    }
}
