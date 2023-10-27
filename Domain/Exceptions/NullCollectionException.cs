using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class NullCollectionException : BadRequestException
    {
        public NullCollectionException()
            : base("Collection is null")
        {

        }
    }
}
