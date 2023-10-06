using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class DataProviderNotFoundExpcetion : NotFoundException
    {
        public DataProviderNotFoundExpcetion(int? dataProviderId)
            : base($"Data Provider with id {dataProviderId} was not found")
        {

        }
    }
}
