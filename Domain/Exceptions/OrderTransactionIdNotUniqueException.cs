using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class OrderTransactionIdNotUniqueException : BadRequestException
    {
        public OrderTransactionIdNotUniqueException()
            : base($"Transaction id must be unique")
        {

        }
    }
}
