using Application.DTO.CarAccidentHistory;
using Application.Validation.CarInspectionHistory;
using Domain.Enum;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarAccidentHistory
{
    public class CarAccidentHistoryParameterValidator : AbstractValidator<CarAccidentHistoryParameter>
    {
        public CarAccidentHistoryParameterValidator()
        {
            RuleFor(x => x.VinId)
           .NotNull()
           .NotEmpty()
           .WithMessage("VinId is required");

            //RuleFor(x => x.Serverity)
            //    .InclusiveBetween(1, 5)
            //    .WithMessage("Rating can only be in range of [0,5]");

            RuleFor(x => x.DamageLocation).IsInEnum().WithMessage("Damage Location Error Input");
            RuleFor(x => x.SortByServerity)
                .InclusiveBetween(-1, 1)
                .WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
            RuleFor(x => x.SortByAccidentDate)
                .InclusiveBetween(-1, 1)
                .WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
            RuleFor(x => x.SortByLastModified)
                .InclusiveBetween(-1, 1)
                .WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
        }
    }
}
