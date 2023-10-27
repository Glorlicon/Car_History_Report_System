using Application.Common.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation
{
    public static class CustomListValidator
    {
        public static ErrorDetails ValidateList<T>(this AbstractValidator<T> validator ,IEnumerable<T> requests)
        {
            var errors = new ErrorDetails();
            foreach (var request in requests)
            {
                var validationResult = validator.Validate(request);
                if (!validationResult.IsValid)
                {
                    foreach (var error in validationResult.Errors)
                    {
                        errors.Error.Add(error.ErrorMessage);
                    }
                }
            }
            return errors;
        }
    }
}
