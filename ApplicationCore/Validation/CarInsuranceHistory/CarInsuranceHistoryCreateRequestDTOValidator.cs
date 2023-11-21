using Application.DTO.CarInsurance;
using Application.DTO.CarServiceHistory;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarInsuranceHistory
{
    public class CarInsuranceHistoryCreateRequestDTOValidator : AbstractValidator<CarInsuranceHistoryCreateRequestDTO>
    {
        public CarInsuranceHistoryCreateRequestDTOValidator()
        {
        }
    }
}
