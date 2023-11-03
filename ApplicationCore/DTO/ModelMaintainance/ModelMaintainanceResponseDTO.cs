using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.ModelMaintainance
{
    public class ModelMaintainanceResponseDTO
    {
        public string ModelId {  get; set; }

        public string MaintenancePart { get; set; }

        public int? OdometerPerMaintainance { get; set; }

        public DateTime? TimePerMaintainance { get; set; }

        public string RecommendAction { get; set; }
    }
}
