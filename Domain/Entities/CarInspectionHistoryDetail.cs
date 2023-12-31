﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarInspectionHistoryDetail
    {
        public int Id { get; set; }
        public int CarInspectionHistoryId { get; set; }
        public string InspectionCategory { get; set; }
        public bool IsPassed { get; set; } = false;
        public string? Note { get; set; }
        public CarInspectionHistory CarInspectionHistory { get; set; }

    }
}
