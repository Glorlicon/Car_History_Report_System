using Application.DTO.CarInspectionHistory;
using Application.DTO.CarServiceHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarInspectionHistory
{
    public class CarInspectionHistoryCreateRequestDTOValidator : AbstractValidator<CarInspectionHistoryCreateRequestDTO>
    {
        public CarInspectionHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.InspectDate).LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now));
            RuleFor(x => x.InspectionNumber).NotEmpty();
            RuleForEach(x => x.CarInspectionHistoryDetail).SetValidator(new CarInspectionHistoryDetailCreateRequestDTOValidator());
        }
    }
}
