using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class CarCurrentDataProviderExist : BadRequestException
    {
        public CarCurrentDataProviderExist(string vinId)
            :base($"car haven't been sold from other data provider")
        {

        }
    }
}
