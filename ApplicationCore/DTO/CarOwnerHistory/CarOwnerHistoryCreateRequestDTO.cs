using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarOwnerHistory
{
    public class CarOwnerHistoryCreateRequestDTO
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        public string? CarId { get; set; }
        public string? Address { get; set; }
        public DateOnly? DOB { get; set; }
        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public string? Note { get; set; }
    }
}
