﻿using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarOwnerHistory
{
    public class CarOwnerHistoryUpdateRequestDTOValidator : AbstractValidator<CarOwnerHistoryUpdateRequestDTO>
    {
        public CarOwnerHistoryUpdateRequestDTOValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .NotNull()
                .Matches(@"(84|0[3|5|7|8|9])+([0-9]{8})\b");
            RuleFor(x => x.DOB).LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today));
            RuleFor(x => x.StartDate)
                .LessThanOrEqualTo(x => x.EndDate)
                .WithMessage("Start Date must be before Endate")
                .When(x => x.EndDate != null);
        }
    }
}
