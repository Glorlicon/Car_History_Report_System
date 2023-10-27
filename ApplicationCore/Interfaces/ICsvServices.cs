using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICsvServices
    {
        string ConvertListObjectToCsvFormat(IEnumerable<object> objects);

        string ConvertObjectToCsvFormat(object obj);

        IEnumerable<T> ConvertToListObject<T>(Stream file);
    }
}
