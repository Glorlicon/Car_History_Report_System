using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class DataProviderNotFoundException : NotFoundException
    {
        public DataProviderNotFoundException(int? dataProviderId)
            : base($"Data Provider not found")
        {

        }
    }   
}
