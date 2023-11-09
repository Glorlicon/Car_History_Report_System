using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarServiceHistory
{
    public class CarServiceHistoryResponseDTO
    {
        public int Id { get; set; }
        public string Source { get; set; }

        public string CarId { get; set; }
        public string OtherServices { get; set; }

        public DateTime ServiceTime { get; set; }

        public DateOnly? ReportDate { get; set; }

        public CarServiceType Services { get; set; }

        public string ServicesName { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }
    }
}
