using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.ModelMaintainance
{
    public class ModelMaintainanceCreateRequestDTO
    {
        public string MaintenancePart { get; set; }

        public int? OdometerPerMaintainance { get; set; }

        public int? DayPerMaintainance { get; set; }

        public string RecommendAction { get; set; }

    }
}
