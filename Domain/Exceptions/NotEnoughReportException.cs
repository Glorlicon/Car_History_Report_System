using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class NotEnoughReportException : BadRequestException
    {
        public NotEnoughReportException()
            :base("User dont have enough report number to get a new report of car, please buy more")
        {

        }
    }
}
