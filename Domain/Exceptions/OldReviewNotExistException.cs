using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class OldReviewNotExistException : NotFoundException
    {
        public OldReviewNotExistException(string userId, int dataProviderId)
    : base($"Review for this data provider not existed")
        {

        }
    }
}
