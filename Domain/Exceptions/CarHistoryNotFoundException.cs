using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarHistoryNotFoundException : NotFoundException
    {
        public CarHistoryNotFoundException(string vinId, string carHistoryType)
            : base($"history record of car not found")
        {

        }
    }
}
