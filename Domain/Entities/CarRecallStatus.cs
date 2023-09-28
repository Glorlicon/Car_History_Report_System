using System;
using System.Collections.Generic;
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
    
        //public enum Status
        //gasdgkoasdogk
    }
}
