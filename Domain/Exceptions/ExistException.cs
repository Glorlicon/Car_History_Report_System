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
            : base($"object already exist in list")
        {

        }
    }
}
