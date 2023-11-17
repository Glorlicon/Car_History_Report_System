using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInsurance
{
    public class CarInsuranceHistoryCreateRequestDTO
    {
        public string InsuranceNumber { get; set; }
        public string CarId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        public int? Odometer { get; set; }
        public DateOnly? ReportDate { get; set; }
    }
}
