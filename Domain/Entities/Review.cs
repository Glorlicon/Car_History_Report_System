using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Review
    {
        public Guid UserId { get; set; }

        public int DataProviderId { get; set; }

        public User User { get; set; }

        public DataProvider DataProvider { get; set; }

        public string? Description {  get; set; }

        public int Rating { get; set; }

        public DateTime CreatedTime { get; set; }
    }
}
