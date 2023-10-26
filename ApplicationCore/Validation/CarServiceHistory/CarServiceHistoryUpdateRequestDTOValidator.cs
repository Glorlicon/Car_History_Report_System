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
            RuleFor(x => x.Services).IsInEnum();
        }
    }
}
