using Domain.Common;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CarAccidentHistory : CarHistory
    {
        public string? Description { get; set; }

        public string? Location { get; set; }

        public float Serverity { get; set; }

        //maybe enum
        public AccidentDamageLocation DamageLocation { get; set; }

        //public enum DamageType {  get; set; }

        public DateOnly AccidentDate {  get; set; }

    }
}
