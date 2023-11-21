using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enum
{
    [Flags]
    public enum AccidentDamageLocation
    {
        None = 0,
        Front = 1,
        Rear = 2,
        Left = 4,
        Right = 8
    }
}
