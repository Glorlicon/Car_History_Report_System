using Application.DTO.CarServiceHistory;
using Domain.Enum;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarServiceHistory
{
    public class CarServiceHistoryCreateRequestDTOValidator : AbstractValidator<CarServiceHistoryCreateRequestDTO>
    {
        public CarServiceHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Odometer).GreaterThanOrEqualTo(0).When(x => x.Odometer != null).WithMessage("Odometer value must be equal or greater than 0");
            RuleFor(x => x.Services).IsInEnum();
        }
    }
}
