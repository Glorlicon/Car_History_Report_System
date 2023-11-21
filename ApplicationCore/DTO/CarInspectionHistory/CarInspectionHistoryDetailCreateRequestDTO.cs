using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInspectionHistory
{
    public class CarInspectionHistoryDetailCreateRequestDTO
    {
        public string InspectionCategory { get; set; }
        public bool IsPassed { get; set; } = false;
        public string? Note { get; set; }
    }
}
