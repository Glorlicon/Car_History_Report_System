using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInsurance
{
    public class CarInsuranceHistoryUpdateRequestDTO
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        public int? Odometer { get; set; }
        public DateOnly? ReportDate { get; set; }
        public string InspectionNumber { get; set; }
    }
}
