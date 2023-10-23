using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderWorkingTimesResponseDTO
    {
        public int DayOfWeek { get; set; }

        public string StartTime {  get; set; }

        public string EndTime { get; set; }

        public bool IsClosed {  get; set; }

    }
}
