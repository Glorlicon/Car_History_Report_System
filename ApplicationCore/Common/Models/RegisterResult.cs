using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Models
{
    public class RegisterResult
    {
        public IdentityResult Result { get; set; }
        public string UserId { get; set; }
        public string VerifyToken { get; set; }

        public RegisterResult(IdentityResult result, string userId, string verifyToken)
        {
            Result = result;
            UserId = userId;
            VerifyToken = verifyToken;
        }
    }
}
