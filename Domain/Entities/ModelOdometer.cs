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

        [Key, Column(Order = 0)]
        public string ModelId { get; set; }

        [Key, Column(Order = 1)]
        public string Name { get; set; }

        public CarSpecification CarSpecification { get; set; }

        public int Odometer { get; set; }

        public RecommendAction Action { get; set; }
    }
}
