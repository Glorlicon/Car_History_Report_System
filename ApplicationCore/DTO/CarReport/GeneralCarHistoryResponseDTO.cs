using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarReport
{
    public class GeneralCarHistoryResponseDTO
    {
        public DateOnly? ReportDate { get; set; }
        public int? Odometer { get; set; }
        public string HistoryType { get; set; }
        public string Source { get; set; }
        public string? Note { get; set; }
    }
}
