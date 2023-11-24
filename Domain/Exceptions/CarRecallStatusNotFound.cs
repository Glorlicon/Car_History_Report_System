using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarRecallStatusNotFound : NotFoundException
    {
        public CarRecallStatusNotFound(string carId, int recallId)
            : base($"Car recall status Not Found")
        {

        }
    }
}
