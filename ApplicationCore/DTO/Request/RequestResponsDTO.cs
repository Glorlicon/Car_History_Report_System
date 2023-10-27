using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.Request
{
    public class RequestResponsDTO
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public string Response {  get; set; }

        public string Type { get; set; }

        public string Status { get; set; }

        public string? CreatedByUserId { get; set; }
        public string? ModifiedByUserId { get; set; }

        public DateTime CreatedTime { get; set; }

        public DateTime LastModified {  get; set; }

    }
}
