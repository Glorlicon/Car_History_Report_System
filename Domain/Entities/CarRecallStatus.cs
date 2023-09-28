using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarRecallStatus
    {
        [Key, Column(Order = 0)]
        public string CarId { get; set; }

        [Key, Column(Order = 1)]
        public int CarRecallId { get; set; }

        public Car Car { get; set; }

        public CarRecall CarRecall { get; set; }
    
        public RecallStatus Status { get; set; }
    }
}
