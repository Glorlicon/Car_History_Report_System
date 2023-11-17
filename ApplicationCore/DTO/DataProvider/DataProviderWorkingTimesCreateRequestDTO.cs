using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderWorkingTimesCreateRequestDTO
    {
        public int DayOfWeek { get; set; }
        public int StartHour { get; set; } = 0;
        public int StartMinute { get; set; } = 0;
        public int EndHour { get; set; } = 0;
        public int EndMinute { get; set; } = 0;
        public bool IsClosed { get; set; } = true;
    }
}
