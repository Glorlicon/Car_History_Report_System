using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class OldReviewExistException : NotFoundException
    {
        public OldReviewExistException(string userId, int dataProviderId)
            : base($"Review for this data provider already existed")
        {

        }
    }
}
