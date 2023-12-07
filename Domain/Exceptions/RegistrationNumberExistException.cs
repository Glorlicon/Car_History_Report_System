using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class RegistrationNumberExistException : BadRequestException
    {
        public RegistrationNumberExistException()
            : base("Registration Number already exist")
        {

        }
    }
}
