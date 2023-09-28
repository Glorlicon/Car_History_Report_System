using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarInspectionHistory
    {
        public string Description { get; set; }

        public DateOnly InspectDate { get; set; }

        public ICollection<CarInspectionHistoryDetail> CarInspectionHistoryDetail { get; set; } = new List<CarInspectionHistoryDetail>();
    }
}
