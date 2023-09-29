using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ModelOdometer
    {

        public string ModelId { get; set; }

        public string MaintenancePart { get; set; }

        public CarSpecification Model { get; set; }

        public int Odometer { get; set; }

        public RecommendAction RecommendAction { get; set; }
    }
}
