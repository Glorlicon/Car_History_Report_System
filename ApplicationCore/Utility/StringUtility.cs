using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Utility
{
    public static class StringUtility
    {
        public const String EMAIL_REGEX = "^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*$";
        public const string LICENSE_PLATE_NUMBER_REGEX = @"^\d{2}[A-Z]{1,2}[-\s]\d{5}$";
        public static bool IsEmailByRegex(string tmp)
        {
            if (tmp == null || tmp.Trim() == "") 
            {
                return false; 
            }
            return Regex.Match(tmp, EMAIL_REGEX, RegexOptions.IgnoreCase).Success;
        }
    }
}
