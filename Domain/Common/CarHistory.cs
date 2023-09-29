using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common
{
    public abstract class CarHistory : BaseAuditableEntity
    {
        [Key]
        public int Id { get; set; }
        public string CarId { get; set; }

        public string? Note { get; set; }

        public Car Car { get; set; } = null!;
    }
}
