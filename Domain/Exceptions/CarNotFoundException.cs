using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarNotFoundException : NotFoundException
    {
        public CarNotFoundException(string vinId)
            : base($"Car with VinId {vinId} Not Found")
        {

        }
        public CarNotFoundException()
            : base($"Car Not Found")
        {

        }
    }
}
