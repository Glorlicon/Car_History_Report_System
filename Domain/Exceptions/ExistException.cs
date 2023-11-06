using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class ExistException : BadRequestException
    {
        public ExistException(string objectName, string Id)
            : base($"{objectName} {Id} already exist in list")
        {

        }
    }
}
