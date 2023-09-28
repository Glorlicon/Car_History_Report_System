using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarOdometerHistory
    {

        public DateOnly ReportDate { get; set; }
        public long OdometerValue { get; set; }
        public string Description { get; set; }
    }
}
