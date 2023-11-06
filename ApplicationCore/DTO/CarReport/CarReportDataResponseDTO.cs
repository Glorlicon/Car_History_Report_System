using Application.DTO.Car;
using Application.DTO.CarRecall;
using Application.DTO.CarSpecification;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarReport
{
    public class CarReportDataResponseDTO
    {
        public string VinId { get; set; }

        public string? LicensePlateNumber { get; set; }

        public string ModelId { get; set; }

        public string ColorName { get; set; }

        public int CurrentOdometer { get; set; }

        public int NumberOfOpenRecalls { get; set; }

        public int NumberOfAccidentRecords { get; set; }

        public int NumberOfStolenRecords { get; set; }

        public int NumberOfOwners { get; set; }

        public int NumberOfServiceHistoryRecords { get; set; }

        public string EngineNumber { get; set; }

        public bool IsModified { get; set; } = false;

        public bool IsCommercialUse { get; set; } = false;

        public CarSpecificationResponseDTO Model { get; set; } = null!;

        public List<CarRecallStatusResponseDTO> CarRecallStatuses { get; set; }

        public List<CarReportCarHistoryDetails> CarHistoryDetails { get; set; }

    }
}
