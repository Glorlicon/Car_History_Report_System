using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Utility
{
    public static class AuthenticationUtility
    {
        public static string GenerateVerificationCode()
        {
            int length = 6;
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
                        .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
