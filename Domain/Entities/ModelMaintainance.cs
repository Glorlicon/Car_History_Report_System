using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ModelMaintainance
    {

        public string ModelId { get; set; }

        public string MaintenancePart { get; set; }

        public CarSpecification Model { get; set; }

        public int? OdometerPerMaintainance { get; set; }

        public int? DayPerMaintainance { get; set; }

        public string RecommendAction { get; set; }
    }
}
