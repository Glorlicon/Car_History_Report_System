using Application.DTO.CarAccidentHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarAccidentHistory
{
    public class CarAccidentHistoryUpdateRequestDTOValidator : AbstractValidator<CarAccidentHistoryUpdateRequestDTO>
    {
        public CarAccidentHistoryUpdateRequestDTOValidator()
        {

        }
    }
}
