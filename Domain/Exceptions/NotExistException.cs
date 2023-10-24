using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class NotExistException : NotFoundException
    {
        public NotExistException(string objectName, string Id)
            : base($"{objectName} {Id} not exist in list")
        {

        }
    }
}
