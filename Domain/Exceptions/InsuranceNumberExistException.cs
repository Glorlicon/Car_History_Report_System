using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class InsuranceNumberExistException : BadRequestException
    {
        public InsuranceNumberExistException()
            : base("Insurance Number already exist")
        {

        }
    }
}
