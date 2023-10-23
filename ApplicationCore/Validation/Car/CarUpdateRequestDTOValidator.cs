using Application.DTO.Car;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.Car
{
    public class CarUpdateRequestDTOValidator : AbstractValidator<CarUpdateRequestDTO>
    {
        public CarUpdateRequestDTOValidator()
        {
            RuleFor(x => x.LicensePlateNumber).NotEmpty().When(x => x.LicensePlateNumber != null).WithMessage("License Plate Number cannot be empty");
            RuleFor(x => x.EngineNumber).NotEmpty().WithMessage("Engine Number cannot be empty");
            RuleFor(x => x.Color).IsInEnum();
        }
    }
}
