using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class WorkingTime
    {
        public int Id { get; set; }

        public int DataProviderId { get; set; }

        public DataProvider DataProvider { get; set; }

        [Range(0,6)]
        public int DayOfWeek { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public bool IsClosed { get; set; }



    }
}
