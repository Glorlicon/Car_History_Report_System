using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.User
{
    public class UserParameter : PagingParameters
    {
        public string? Username { get; set; }

        public string? Email { get; set; }

        public Role? Role { get; set; }

        public string? DataProviderName { get; set; }

        public int SortByDataProvider { get; set; } = 0;

        public int SortByRole { get; set; } = 0;
    }
}
