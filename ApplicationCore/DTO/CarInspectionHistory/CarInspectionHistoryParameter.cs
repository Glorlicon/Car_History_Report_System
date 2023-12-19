using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInspectionHistory
{
    public class CarInspectionHistoryParameter : PagingParameters
    {
        public string? CarId { get; set; }
        public string? InspectionNumber { get; set; } 
        public DateOnly? InspectionStartDate { get; set; }
        public DateOnly? InspectionEndDate { get; set; }
    }
}
