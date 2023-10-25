using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class RequestNotFoundException : NotFoundException
    {
        public RequestNotFoundException(int id)
            : base($"Request with id {id} was not found")
        {

        }
    }
}
