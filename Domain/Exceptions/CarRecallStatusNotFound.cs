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
            : base($"Car recall status of car with id {carId} and recall Id {recallId} Not Found")
        {

        }
    }
}
