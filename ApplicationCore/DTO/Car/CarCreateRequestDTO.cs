using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Car
{
    public class CarCreateRequestDTO
    {
        public string VinId { get; set; }

        public string? LicensePlateNumber { get; set; }

        public string ModelId { get; set; }

        public Color Color { get; set; }

        public string EngineNumber { get; set; }

        public bool IsModified { get; set; } = false;

        public bool IsCommercialUse { get; set; } = false;

        public List<CarImagesCreateDTO>? CarImages { get; set; }
    }
}
