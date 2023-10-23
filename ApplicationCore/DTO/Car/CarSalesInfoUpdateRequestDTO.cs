using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Car
{
    public class CarSalesInfoUpdateRequestDTO
    {
        public string Description { get; set; }

        public string? Notes { get; set; }

        public List<string> Features { get; set; }

        public decimal Price { get; set; }

        public List<CarImagesCreateDTO>? CarImages { get; set; }
    }
}
