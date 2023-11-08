using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarReport
    {
        public string UserId { get; set; }
        public string CarId { get; set; }

        public User User { get; set; }

        public Car Car { get; set; }

        public DateOnly CreatedDate { get; set; }
    }
}
