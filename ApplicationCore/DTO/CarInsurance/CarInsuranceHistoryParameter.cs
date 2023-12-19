using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarInsurance
{
    public class CarInsuranceHistoryParameter : PagingParameters
    {
        public string? VinId { get; set; }

        public string? InsuranceNumber { get; set; }

        public DateOnly? StartStartDate { get; set; }
        public DateOnly? StartEndDate { get; set; }

        public DateOnly? EndStartDate { get; set; }
        public DateOnly? EndEndDate { get; set; }

        public int SortByLastModified { get; set; } = 0;
    }
}
