using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Models
{
    public class LoginResult
    {
        public string Token { get; set; }
        public bool Succeed { get; set; }

        public bool IsUserExist { get; set; }

        public bool IsEmailVerified { get; set; }

        public bool IsSuspended { get; set; }

        public LoginResult(string token, bool succeed, bool isUserExist, bool isEmailVerified, bool isSuspended)
        {
            Token = token;
            Succeed = succeed;
            IsUserExist = isUserExist;
            IsEmailVerified = isEmailVerified;
            IsSuspended = isSuspended;
        }

    }
}
