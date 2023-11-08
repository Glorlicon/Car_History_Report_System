using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarReport
{
    public class CarReportResponseDTO
    {
        public string UserId { get; set; }
        public string CarId { get; set; }
        public DateOnly CreatedDate { get; set; }
    }
}
