using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarInsurance : CarHistory
    {
        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public string? Description { get; set; }
    }
}
