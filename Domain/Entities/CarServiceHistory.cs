using Domain.Common;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarServiceHistory : CarHistory
    {
        public string OtherServices { get; set; }

        public DateTime ServiceTime { get; set; }

        public CarServiceType Services { get; set; }
    }
}
