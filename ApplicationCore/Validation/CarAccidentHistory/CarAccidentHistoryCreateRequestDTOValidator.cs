using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInspectionHistory;
using Application.Validation.CarInspectionHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarAccidentHistory
{
    public class CarAccidentHistoryCreateRequestDTOValidator : AbstractValidator<CarAccidentHistoryCreateRequestDTO>
    {
        public CarAccidentHistoryCreateRequestDTOValidator()
        {

        }
    }
}
