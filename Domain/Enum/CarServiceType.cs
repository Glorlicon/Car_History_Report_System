using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enum
{
    [Flags]
    public enum CarServiceType
    {
        None = 0,
        TireRotation = 1,
        OilChange = 2,
        ChangePart = 4,
        BrakeInspection = 8,
        RepairCarRecall = 16,
        Other = 32
    }
}
