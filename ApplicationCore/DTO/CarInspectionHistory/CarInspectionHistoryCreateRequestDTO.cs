using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInspectionHistory
{
    public class CarInspectionHistoryCreateRequestDTO
    {
        public string CarId { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }

        public DateOnly? ReportDate { get; set; }

        public string Description { get; set; }

        public string InspectionNumber { get; set; }

        public DateOnly InspectDate { get; set; }

        public List<CarInspectionHistoryDetailCreateRequestDTO> CarInspectionHistoryDetail { get; set; }
    }
}
