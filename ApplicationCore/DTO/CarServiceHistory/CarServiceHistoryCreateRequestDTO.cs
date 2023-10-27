using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarServiceHistory
{
    public class CarServiceHistoryCreateRequestDTO
    {
        public string CarId { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }
        public string OtherServices { get; set; }

        public DateTime ServiceTime { get; set; }

        public CarServiceType Services { get; set; }
    }
}
