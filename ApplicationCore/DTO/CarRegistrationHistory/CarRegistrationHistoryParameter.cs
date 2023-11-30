using Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRegistrationHistory
{
    public class CarRegistrationHistoryParameter : PagingParameters
    {
        public string? CarId { get; set; }
        public string? OwnerName { get; set; }
        public string? RegistrationNumber { get; set; }
        public DateOnly? ExpireDateStart { get; set; }
        public DateOnly? ExpireDateEnd { get; set; }

        public string? LicensePlateNumber { get; set; }
    }
}
