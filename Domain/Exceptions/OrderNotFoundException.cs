using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class OrderNotFoundException : NotFoundException
    {
        public OrderNotFoundException(int id)
            : base($"Order not found")
        {

        }
    }
}
