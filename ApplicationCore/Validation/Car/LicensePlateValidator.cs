using Application.DTO.Car;
using Application.Utility;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Validation.Car
{
    public static class LicensePlateValidator
    {
        public static bool Validate(string searchString)
        {
            if (string.IsNullOrEmpty(searchString))
                return false;
            if (!Regex.IsMatch(searchString, StringUtility.LICENSE_PLATE_NUMBER_SEARCH_REGEX))
                return false;
            int wildcard = 0;
            foreach (var c in searchString)
            {
                if(c == '*') wildcard++;
            }
            if (wildcard > 2)
                return false;
            return true;
        }
    }
}
