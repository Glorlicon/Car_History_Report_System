using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarRegistrationHistory
{
    public class CarRegistrationHistoryResponseDTO
    {
        public string CarId { get; set; }
        public string OwnerName { get; set; }
        public string RegistrationNumber { get; set; }

        public DateOnly ExpireDate { get; set; }

        public string LicensePlateNumber { get; set; }

        public string? Note { get; set; }

        public int? Odometer { get; set; }

        public DateOnly? ReportDate { get; set; }

        public string? Source { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime LastModified { get; set; }
    }
}
