using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Application.Utility
{
    public static class UserUtility
    {
        private readonly static Random _rand = new Random();

        public static string GenerateRandomPassword(int length)
        {
            const string lower = "abcdefghijkmnopqrstuvwxyz";
            const string upper = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
            const string number = "1234567890";
            const string special = "!@#$%^&*_-=+";
            // Get cryptographically random sequence of bytes
            var bytes = new byte[length];
            new RNGCryptoServiceProvider().GetBytes(bytes);

            // Build up a string using random bytes and character classes
            var res = new StringBuilder();
            foreach (byte b in bytes)
            {
                // Randomly select a character class for each byte
                switch (_rand.Next(4))
                {
                    // In each case use mod to project byte b to the correct range
                    case 0:
                        res.Append(lower[b % lower.Length]);
                        break;
                    case 1:
                        res.Append(upper[b % upper.Length]);
                        break;
                    case 2:
                        res.Append(number[b % number.Length]);
                        break;
                    case 3:
                        res.Append(special[b % special.Length]);
                        break;
                }
            }
            return res.ToString();
        }
    }
}
