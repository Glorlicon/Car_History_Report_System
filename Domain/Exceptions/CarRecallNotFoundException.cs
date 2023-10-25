using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarRecallNotFoundException : NotFoundException
    {
        public CarRecallNotFoundException(int id)
            : base($"Car Recall with id {id} Not Found")
        {

        }
    }
}
