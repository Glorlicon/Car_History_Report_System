using Application.DTO.CarInspectionHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarInspectionHistory
{
    public class CarInspectionHistoryDetailCreateRequestDTOValidator : AbstractValidator<CarInspectionHistoryDetailCreateRequestDTO>
    {
        public CarInspectionHistoryDetailCreateRequestDTOValidator()
        {
            RuleFor(x => x.InspectionCategory).NotEmpty().WithMessage("InspectionCategory should not be empty");
        }
    }
}
