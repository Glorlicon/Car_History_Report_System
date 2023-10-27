using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderContactCreateRequestDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? ZipCode { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string VinId { get; set; }
    }
}
