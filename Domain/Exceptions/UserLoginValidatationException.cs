using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class UserLoginValidatationException : BadRequestException
    {
        public UserLoginValidatationException()
            : base($"Login failed because username/email or password is wrong")
        {

        }
    }
}
