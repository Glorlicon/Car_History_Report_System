using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class CarHistory
    {
        [Key]
        public int Id { get; set; }
        public string CarId { get; set; }

        public Guid UserId { get; set; }

        public string? Note { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }

        public Car Car { get; set; } = null!;

        public User User { get; set; } = null!;
    }
}
