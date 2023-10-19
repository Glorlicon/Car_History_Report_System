using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarPartNotFoundException : NotFoundException
    {
        public CarPartNotFoundException(int id)
            : base($"Car Part with id {id} Not Found")
        {

        }
    }
}
