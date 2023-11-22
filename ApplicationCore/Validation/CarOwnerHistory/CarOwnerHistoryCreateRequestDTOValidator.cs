using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarOwnerHistory
{
    public class CarOwnerHistoryCreateRequestDTOValidator : AbstractValidator<CarOwnerHistoryCreateRequestDTO>
    {
        public CarOwnerHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name should not be empty");
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .NotNull()
                .Matches(@"(84|0[3|5|7|8|9])+([0-9]{8})\b")
                .WithMessage("Invalid phone number");
            RuleFor(x => x.DOB).LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("DOB cannot be in the future");
            RuleFor(x => x.StartDate)
                .LessThanOrEqualTo(x => x.EndDate)
                .WithMessage("Start Date must be before Endate")
                .When(x => x.EndDate != null);
        }
    }
}
