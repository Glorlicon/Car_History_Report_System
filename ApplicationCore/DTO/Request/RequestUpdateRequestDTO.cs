using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Request
{
    public class RequestUpdateRequestDTO
    {
        public string Response { get; set; }

        public UserRequestStatus Status { get; set; }
    }
}
