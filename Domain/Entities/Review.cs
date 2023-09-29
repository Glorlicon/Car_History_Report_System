using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Review
    {
        public string UserId { get; set; }
        public int DataProviderId { get; set; }

        public User User { get; set; }

        public DataProvider DataProvider { get; set; }

        public string? Description {  get; set; }

        public int Rating { get; set; }

        public DateTime CreatedTime { get; set; }
    }
}
