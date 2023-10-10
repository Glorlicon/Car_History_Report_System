using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarImages
    {
        public int Id { get; set; }

        public string CarId { get; set; }

        public Car Car { get; set; }

        public string ImageLink { get; set; }
    }
}
