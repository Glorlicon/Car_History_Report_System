using Application.DTO.CarRegistrationHistory;
using Application.Utility;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarRegistrationHistory
{
    public class CarRegistrationHistoryCreateRequestDTOValidator : AbstractValidator<CarRegistrationHistoryCreateRequestDTO>
    {
        public CarRegistrationHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Odometer).GreaterThanOrEqualTo(0).When(x => x.Odometer != null).WithMessage("Odometer value must be equal or greater than 0");
            RuleFor(x => x.OwnerName).NotEmpty();
            RuleFor(x => x.LicensePlateNumber)
                .Matches(StringUtility.LICENSE_PLATE_NUMBER_REGEX)
                .WithMessage("License Plate Number should be correct format Ex: 12A-12345");
            RuleFor(x => x.ReportDate).LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now))
                .WithMessage("Report Date cannot be in the future");
            RuleFor(x => x.RegistrationNumber).NotEmpty().WithMessage("Registration Number cannot be empty");
        }
    }
}
