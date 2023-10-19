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
            : base($"{carHistoryType} of car with vinId {vinId} Not Found")
        {

        }
    }
}
