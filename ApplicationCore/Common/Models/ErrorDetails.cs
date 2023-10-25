using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.Common.Models
{
    public class ErrorDetails
    {
        public string Error { get; set; }
        public override string ToString() => JsonSerializer.Serialize(this);
    }
}
