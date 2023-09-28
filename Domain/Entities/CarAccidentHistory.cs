    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarAccidentHistory
    {
        public int ID { get; set; }

        public string CarId { get; set; }

        public Guid UserId { get; set; }

        public User User { get; set; }

        public Car Car { get; set; }

        public string? Description { get; set; }

        public string? Location { get; set; }

        //maybe enum
        public string Serverity { get; set; }

        //maybe enum
        public string DamageLocation { get; set; }

        //public enum DamageType {  get; set; }

        public DateOnly Date {  get; set; }

        public DateTime CreatedTime { get; set; }
    }
}
