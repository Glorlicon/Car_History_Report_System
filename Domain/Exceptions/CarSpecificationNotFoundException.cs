using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarSpecificationNotFoundException : NotFoundException
    {
        public CarSpecificationNotFoundException(string modelId)
            : base($"Car Model with id {modelId} was not found")
        {

        }
    }
}
