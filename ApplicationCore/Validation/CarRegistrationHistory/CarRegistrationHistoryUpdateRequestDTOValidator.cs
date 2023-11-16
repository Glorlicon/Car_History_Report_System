using Application.DTO.CarRegistrationHistory;
using Application.DTO.CarServiceHistory;
using Application.Utility;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarRegistrationHistory
{
    public class CarRegistrationHistoryUpdateRequestDTOValidator : AbstractValidator<CarRegistrationHistoryUpdateRequestDTO>
    {
        public CarRegistrationHistoryUpdateRequestDTOValidator()
        {
            RuleFor(x => x.OwnerName).NotEmpty();
            RuleFor(x => x.LicensePlateNumber)
                .Matches(StringUtility.LICENSE_PLATE_NUMBER_REGEX)
                .WithMessage("License Plate Number should be in correct format Ex: 12A-12345");
            RuleFor(x => x.ReportDate).LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now));
            RuleFor(x => x.RegistrationNumber).NotEmpty();
        }
    }
}
