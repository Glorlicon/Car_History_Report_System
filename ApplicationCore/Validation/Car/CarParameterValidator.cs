using Application.DTO.Car;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.Car
{
    public class CarParameterValidator : AbstractValidator<CarParameter>
    {
        public CarParameterValidator()
        {
            RuleFor(x => x.YearStart).LessThanOrEqualTo(x => x.YearEnd).WithMessage("Year Start Have to be smaller than Year End");
            RuleFor(x => x.PriceMin).LessThanOrEqualTo(x => x.PriceMax).WithMessage("Price Min Have to be smaller than Price Max");
            RuleFor(x => x.MileageMin).LessThanOrEqualTo(x => x.MileageMax).WithMessage("Mileage Min Have to be smaller than Mileage Max");
            RuleFor(x => x.SortByDate).InclusiveBetween(-1, 1).WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
            RuleFor(x => x.SortByMileage).InclusiveBetween(-1, 1).WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
            RuleFor(x => x.SortByPrice).InclusiveBetween(-1, 1).WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
        }
    }
}
