using Application.DTO.CarSpecification;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Car
{
    public class CarResponseDTO
    {
        [Key]
        public string VinId { get; set; }

        public string? LicensePlateNumber { get; set; }

        public string ModelId { get; set; }

        public Color Color { get; set; }

        public string ColorName { get; set; }

        public int CurrentOdometer { get; set; }

        public string EngineNumber { get; set; }

        public bool IsModified { get; set; } = false;

        public bool IsCommercialUse { get; set; } = false;

        public int? CurrentDataProviderId { get; set; }

        public CarSpecificationResponseDTO Model { get; set; } = null!;
        public CarSalesInfoResponseDTO? CarSalesInfo { get; set; }

        public List<CarImagesResponseDTO> CarImages { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }
    }
}
