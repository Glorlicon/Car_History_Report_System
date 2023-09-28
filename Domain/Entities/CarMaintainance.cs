using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarMaintainance
    {

        [Key, Column(Order = 0)]
        public Guid UserId { get; set; }

        [Key, Column(Order = 1)]
        public int CarId { get; set; }

        public Car Car { get; set; }

        public User User { get; set; }

        public bool isDeleted { get; set; } = false;
    }
}
