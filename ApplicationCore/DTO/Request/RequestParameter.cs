using Application.Common.Models;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Request
{
    public class RequestParameter : PagingParameters
    {
        public UserRequestType? RequestType { get; set; }
        public UserRequestStatus? RequestStatus { get; set; }
        public int SortByDate { get; set; } = 0;
    }

}
