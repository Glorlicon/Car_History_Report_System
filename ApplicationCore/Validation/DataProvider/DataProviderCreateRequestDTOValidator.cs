﻿using Application.DTO.DataProvider;
using Application.Utility;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.DataProvider
{
    public class DataProviderCreateRequestDTOValidator : AbstractValidator<DataProviderCreateRequestDTO>
    {
        public DataProviderCreateRequestDTOValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .NotNull();
            RuleFor(x => x.Description)
                .NotEmpty()
                .NotNull();
            RuleFor(x => x.Type)
                .IsInEnum();
            RuleFor(x => x.Email)
                .Matches(StringUtility.EMAIL_REGEX).WithMessage("Invalid email");
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .NotNull()
                .Matches(@"(84|0[3|5|7|8|9])+([0-9]{8})\b").WithMessage("Invalid phone number");
            RuleForEach(x => x.WorkingTimes).SetValidator(new DataProviderWorkingTimesCreateRequestDTOValidator());
        }
    }
}
