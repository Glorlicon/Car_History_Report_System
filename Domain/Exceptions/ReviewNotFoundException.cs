using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class ReviewNotFoundException : NotFoundException
    {
        public ReviewNotFoundException(string userId, int dataProviderId)
            : base($"Review with userid {userId} and dataProviderId {dataProviderId} was not found")
        {

        }
    }
}
