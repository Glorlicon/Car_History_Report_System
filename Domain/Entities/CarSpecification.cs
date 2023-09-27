using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarSpecification
    {
        [Key]
        public string ModelID { get; set; }

        public int ManufacturerId { get; set; }

        public string? WheelFormula { get; set; }

        public string? WheelTread { get; set; }

        public string? Dimension { get; set; }

        public int? WheelBase { get; set; }
        public int? Weight { get; set; }
        public DateOnly ReleasedDate { get; set; }
        public string Country { get; set; }

        public string? Fuel { get; set; }

        public string? BodyType { get; set; }

        public string? RidingCapacity { get; set; }

        public DataProvider Manufacturer { get; set; }

        public ICollection<ModelOdometer> ModelOdometers { get; set; } = new List<ModelOdometer>();
        public ICollection<CarRecall> CarRecalls { get; set; } = new List<CarRecall>();
    }
}
