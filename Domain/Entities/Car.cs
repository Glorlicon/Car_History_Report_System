using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Car
    {
        public string VinID { get; set; }

        public string ModelID { get; set; }
        public CarSpecification Model { get; set; }

    }
}
