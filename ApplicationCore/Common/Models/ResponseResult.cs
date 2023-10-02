using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Models
{
    public class ResponseResult
    {
        internal ResponseResult(bool succeeded, IEnumerable<string> errors)
        {
            Succeeded = succeeded;
            Errors = errors.ToArray();
        }

        public bool Succeeded { get; set; }

        public string[] Errors { get; set; }

        public static ResponseResult Success()
        {
            return new ResponseResult(true, Array.Empty<string>());
        }

        public static ResponseResult Failure(IEnumerable<string> errors)
        {
            return new ResponseResult(false, errors);
        }

        public static ResponseResult Failure(string errors)
        {
            return new ResponseResult(false, new List<string>() { errors });
        }
    }
}
