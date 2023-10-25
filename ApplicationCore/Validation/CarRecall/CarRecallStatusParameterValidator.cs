using Application.DTO.Car;
using Application.DTO.CarRecall;
using Domain.Enum;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarRecall
{
    public class CarRecallStatusParameterValidator : AbstractValidator<CarRecallStatusParameter>
    {
        public CarRecallStatusParameterValidator()
        {
            RuleFor(x => x.Status)
                .IsEnumName(typeof(RecallStatus))
                .When(x => x.Status != null)
                .WithMessage("Status should be Open or Closed only");
        }
    }
}
