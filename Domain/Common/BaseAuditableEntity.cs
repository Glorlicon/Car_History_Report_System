using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common
{
    public abstract class BaseAuditableEntity
    {
        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified { get; set; }

        public User CreatedByUser { get; set; }
        public User ModifiedByUser { get; set; }
    }
}
