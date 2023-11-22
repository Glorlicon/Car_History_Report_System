using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class OrderOptionNotFoundException : NotFoundException
    {
        public OrderOptionNotFoundException(int id)
            : base($"Order Option not found")
        {

        }
    }
}
