using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarServiceHistory
{
    public class CarServiceHistoryUpdateRequestDTO
    {
        public string OtherServices { get; set; }

        public DateTime ServiceTime { get; set; }

        public DateOnly? ReportDate { get; set; }

        public CarServiceType Services { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }
    }
}
