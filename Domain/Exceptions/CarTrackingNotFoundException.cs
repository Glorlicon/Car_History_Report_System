using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarTrackingNotFoundException : NotFoundException
    {
        public CarTrackingNotFoundException(string userId, string carId)
            : base($"User currently not tracking this car")
        {

        }
    }
}
