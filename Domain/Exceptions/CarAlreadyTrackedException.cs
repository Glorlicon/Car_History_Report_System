using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarAlreadyTrackedException : BadRequestException
    {
        public CarAlreadyTrackedException(string userId, string carId)
            : base($"car have already been tracked by user")
        {

        }
    }
}
