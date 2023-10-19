using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarPart
{
    public class CarPartCreateRequestDTO
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public int? ManufacturerId { get; set; }
    }
}
