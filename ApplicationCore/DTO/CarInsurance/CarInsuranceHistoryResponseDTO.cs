using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInsurance
{
    public class CarInsuranceHistoryResponseDTO
    {
        public int Id { get; set; }
        public string Source { get; set; }
        public string InsuranceNumber { get; set; }
        public string CarId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string? Description { get; set; }
        public string? Note { get; set; }
        public int? Odometer { get; set; }
        public DateOnly? ReportDate { get; set; }
        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime LastModified { get; set; }
        public bool Expired
        {
            get 
            { 
                return EndDate < DateOnly.FromDateTime(DateTime.Now); 
            }
        }
    }
}
