using Domain.Common;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Car : BaseAuditableEntity
    {
        [Key]
        public string VinId { get; set; }

        public string? LicensePlateNumber { get; set; }

        public string ModelId { get; set; }

        public Color Color { get; set; }

        public string EngineNumber { get; set; }

        public bool IsModified { get; set; } = false;

        public bool IsCommercialUse { get; set; } = false;

        public CarSpecification Model { get; set; } = null!;

        public ICollection<CarServiceHistory> CarServiceHistories { get; set; } = new List<CarServiceHistory>();

        public ICollection<CarAccidentHistory> CarAccidentHistories { get; set; } = new List<CarAccidentHistory>();
        public ICollection<CarInspectionHistory> CarInspectionHistories { get; set; } = new List<CarInspectionHistory>();
        public ICollection<CarInsurance> CarInsurances { get; set; } = new List<CarInsurance>();
        public ICollection<CarOdometerHistory> CarOdometerHistories { get; set; } = new List<CarOdometerHistory>();

        public ICollection<CarOwnerHistory> CarOwnerHistories { get; set; } = new List<CarOwnerHistory>();

        public ICollection<CarRecallStatus> CarRecallStatuses { get; set; } = new List<CarRecallStatus>();

        public ICollection<CarPart> CarParts { get; set; } = new List<CarPart>();

        public ICollection<CarMaintainance> CarMaintainances { get; set; } = new List<CarMaintainance>();
        public ICollection<CarStolenHistory> CarStolenHistories { get; set; } = new List<CarStolenHistory>();
        public CarSalesInfo? CarSalesInfo { get; set; }

    }
}
