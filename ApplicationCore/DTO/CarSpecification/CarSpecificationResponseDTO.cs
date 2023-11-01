using Application.DTO.ModelMaintainance;
using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarSpecification
{
    public class CarSpecificationResponseDTO
    {
        public string ModelID { get; set; }

        public int? ManufacturerId { get; set; }

        public string ManufacturerName { get; set; }

        public string? WheelFormula { get; set; }

        public string? WheelTread { get; set; }

        public string? Dimension { get; set; }

        public int? WheelBase { get; set; }
        public int? Weight { get; set; }
        public DateOnly ReleasedDate { get; set; }
        public string Country { get; set; }

        public FuelType FuelType { get; set; }

        public BodyType BodyType { get; set; }

        public int RidingCapacity { get; set; }

        public int PersonCarriedNumber { get; set; }

        public int SeatNumber { get; set; }

        public int LayingPlaceNumber { get; set; }

        public int MaximumOutput { get; set; }

        public int EngineDisplacement { get; set; }
        public int RPM { get; set; }

        public int TireNumber { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }

        public List<ModelMaintainanceResponseDTO>? ModelOdometers { get; set; }

    }
}
