using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarAccidentHistory
    {
        public int ID { get; set; }

        public string CarId { get; set; }

        public string UserId { get; set; }

        public User User { get; set; }

        public Car Car { get; set; }
    }
}
