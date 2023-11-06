using Domain.Common;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Request : BaseAuditableEntity
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public string? Response { get; set; }

        public UserRequestType Type { get; set; }

        public UserRequestStatus Status { get; set; }
    }
}
