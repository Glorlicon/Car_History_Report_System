using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarInspectionHistoryDetail
    {
        public int Id { get; set; }
        public int HistoryId { get; set; }
        public string InspectionPart { get; set; }
        public bool isPassed { get; set; } = false;
        public CarInspectionHistory CarInspectionHistory { get; set; }

    }
}
