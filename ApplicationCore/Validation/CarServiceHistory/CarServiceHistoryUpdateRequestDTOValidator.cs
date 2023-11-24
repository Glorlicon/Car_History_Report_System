using Application.DTO.CarServiceHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarServiceHistory
{
    public class CarServiceHistoryUpdateRequestDTOValidator : AbstractValidator<CarServiceHistoryUpdateRequestDTO>
    {
        public CarServiceHistoryUpdateRequestDTOValidator()
        {
            RuleFor(x => x.Odometer).GreaterThanOrEqualTo(0).When(x => x.Odometer != null).WithMessage("Odometer value must be equal or greater than 0");
            RuleFor(x => x.Services).IsInEnum();
        }
    }
}
