using Application.DTO.DataProvider;
using Application.Utility;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.DataProvider
{
    public class DataProviderUpdateRequestDTOValidator : AbstractValidator<DataProviderUpdateRequestDTO>
    {
        public DataProviderUpdateRequestDTOValidator()
        {
            RuleFor(x => x.Name).NotEmpty().NotNull().WithMessage("Name should not be empty");
            RuleFor(x => x.Description).NotEmpty().NotNull().WithMessage("Description should not be empty");
            RuleFor(x => x.Type)
                .IsInEnum();
            RuleFor(x => x.Email)
                .Matches(StringUtility.EMAIL_REGEX).WithMessage("Invalid email");
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .NotNull()
                .Matches(@"(84|0[3|5|7|8|9])+([0-9]{8})\b").WithMessage("Invalid phone number");
            RuleForEach(x => x.WorkingTimes).SetValidator(new DataProviderWorkingTimesUpdateRequestDTOValidator());
        }
    }
}
