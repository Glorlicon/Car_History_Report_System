using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInspectionHistory;
using Application.Validation.CarInspectionHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarAccidentHistory
{
    public class CarAccidentHistoryCreateRequestDTOValidator : AbstractValidator<CarAccidentHistoryCreateRequestDTO>
    {
        public CarAccidentHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Odometer).GreaterThanOrEqualTo(0).When(x => x.Odometer != null).WithMessage("Odometer value must be equal or greater than 0");
        }
    }
}
