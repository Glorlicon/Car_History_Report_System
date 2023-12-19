using Application.DTO.CarInspectionHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarInspectionHistory
{
    public class CarInspectionHistoryUpdateRequestDTOValidator : AbstractValidator<CarInspectionHistoryUpdateRequestDTO>
    {
        public CarInspectionHistoryUpdateRequestDTOValidator()
        {
            RuleFor(x => x.Odometer).GreaterThanOrEqualTo(0).When(x => x.Odometer != null).WithMessage("Odometer value must be equal or greater than 0");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description cannot be empty");
            RuleFor(x => x.InspectDate).LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).WithMessage("Inspect Date cannot be in the future");
            RuleFor(x => x.InspectionNumber).NotEmpty().WithMessage("Inspection Number should not be empty");
            RuleForEach(x => x.CarInspectionHistoryDetail).SetValidator(new CarInspectionHistoryDetailCreateRequestDTOValidator());
        }
    }
}
