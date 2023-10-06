using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Address { get; set; }
        public string? WebsiteLink { get; set; }
        public string? Service { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public DataProviderType Type { get; set; }

        public string TypeName { get; set; }
    }
}
