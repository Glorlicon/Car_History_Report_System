using Application.DTO.CarServiceHistory;
using Domain.Enum;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarServiceHistory
{
    public class CarServiceHistoryCreateRequestDTOValidator : AbstractValidator<CarServiceHistoryCreateRequestDTO>
    {
        public CarServiceHistoryCreateRequestDTOValidator()
        {
            RuleFor(x => x.Services).IsInEnum();
        }
    }
}
