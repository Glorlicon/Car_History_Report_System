using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInspectionHistory
{
    public class CarInspectionHistoryResponseDTO
    {
        public string Id { get; set; }
        public string CarId { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }

        public DateOnly? ReportDate { get; set; }

        public string Source { get; set; }

        public string Description { get; set; }

        public string InspectionNumber { get; set; }

        public DateOnly InspectDate { get; set; }

        public List<CarInspectionHistoryDetailResponseDTO> CarInspectionHistoryDetail { get; set; }
    }
}
