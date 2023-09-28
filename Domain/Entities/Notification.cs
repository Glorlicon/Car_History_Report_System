using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enum

namespace Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }

        public int RelatedCarId { get; set; }

        public Car Car { get; set; }

        public Guid RelatedUserId { get; set; }

        public User User { get; set; }

        public String? Description { get; set; }

        //public Type Type { get; set; }

        public DateTime CreatedTime { get; set; }

        public String? RelatedLink { get; set; }
    }
}
