using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarReportNotFoundException : NotFoundException
    {
        public CarReportNotFoundException(string carId, string userId)
            : base($"User dont own car report for this Car")
        {

        }
    }
}
