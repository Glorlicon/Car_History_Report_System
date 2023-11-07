using Domain.Common;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarStolenHistory : CarHistory
    {
        public string? Descripton { get; set; }

        public CarStolenStatus Status { get; set; }
    }
}
