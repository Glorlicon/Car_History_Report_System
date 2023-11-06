using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Request
{
    public class RequestCreateRequestDTO
    {
        public string Description {  get; set; }
        public UserRequestType Type { get; set; }
    }
}
