using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarStolenHistory
    {
        public int Id { get; set; }

        public string? Descripton { get; set; }
    
        public DateTime Date { get; set; }

        public int CarId { get; set; }

        public Guid UserId {  get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public DateTime CreatedTime { get; set; }

        public User User { get; set; }

        public Car Car { get; set; }
    }
}
