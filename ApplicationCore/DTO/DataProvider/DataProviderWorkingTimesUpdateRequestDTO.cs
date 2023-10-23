using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderWorkingTimesUpdateRequestDTO
    {
        [Range(0, 6)]
        public int DayOfWeek { get; set; }
        [Range(0, 23)]
        public int StartHour { get; set; }
        [Range(0, 59)]
        public int StartMinute { get; set; }
        [Range(0, 23)]
        public int EndHour { get; set; }
        [Range(0, 59)]
        public int EndMinute { get; set; }
        public bool IsClosed { get; set; }
    }
}
