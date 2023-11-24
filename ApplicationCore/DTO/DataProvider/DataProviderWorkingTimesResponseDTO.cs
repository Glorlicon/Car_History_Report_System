using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderWorkingTimesResponseDTO
    {
        public int DayOfWeek { get; set; }

        public string _startTime;
        public string _endTime;
        public string StartTime
        {
            get
            {
                return TimeOnly.Parse(_startTime, CultureInfo.InvariantCulture).ToString("t", CultureInfo.InvariantCulture);
            }
            set
            {
                _startTime = value;
            }
        }
        public string EndTime
        {
            get
            {
                return TimeOnly.Parse(_endTime, CultureInfo.InvariantCulture).ToString("t", CultureInfo.InvariantCulture);
            }
            set
            {
                _endTime = value;
            }
        }

        public bool IsClosed { get; set; }
    }
}
