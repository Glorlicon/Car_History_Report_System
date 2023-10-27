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
        public List<string> Error { get; set; } = new List<string>();
        public override string ToString() => JsonSerializer.Serialize(this);
    }
}
