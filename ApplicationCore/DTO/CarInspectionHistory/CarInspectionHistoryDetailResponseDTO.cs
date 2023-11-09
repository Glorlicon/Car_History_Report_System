using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInspectionHistory
{
    public class CarInspectionHistoryDetailResponseDTO
    {
        public int Id { get; set; }
        public int CarInspectionHistoryId { get; set; }
        public string InspectionCategory { get; set; }
        public bool IsPassed { get; set; }
        public string? Note { get; set; }
    }
}
