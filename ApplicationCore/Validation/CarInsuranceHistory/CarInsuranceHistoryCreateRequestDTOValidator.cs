using Application.DTO.CarInsurance;
using Application.DTO.CarServiceHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarInsuranceHistory
{
    public class CarInsuranceHistoryCreateRequestDTOValidator : AbstractValidator<CarInsuranceHistoryCreateRequestDTO>
    {
        public CarInsuranceHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Odometer).GreaterThanOrEqualTo(0).When(x => x.Odometer != null).WithMessage("Odometer value must be equal or greater than 0");
        }
    }
}
