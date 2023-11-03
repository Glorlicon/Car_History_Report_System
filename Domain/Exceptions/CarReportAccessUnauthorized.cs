using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarReportAccessUnauthorized : UnauthorizedException
    {
        public CarReportAccessUnauthorized(string carId)
            : base($"You don't own or don't have right to access car report for car with ID {carId} ")
        {

        }
    }
}
