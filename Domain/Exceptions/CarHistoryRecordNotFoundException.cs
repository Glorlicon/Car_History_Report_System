using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarHistoryRecordNotFoundException : NotFoundException
    {
        public CarHistoryRecordNotFoundException(int id, string carHistoryType = "Car History")
            : base($"car history record Not Found")
        {

        }
    }
}
