using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarPart
{
    public class CarPartResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string? Description { get; set; }

        public int? ManufacturerId { get; set; }

        public string? ManufacturerName { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }
    }
}
