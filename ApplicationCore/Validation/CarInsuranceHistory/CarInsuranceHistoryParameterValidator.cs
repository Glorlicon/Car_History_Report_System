using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInsurance;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.CarInsuranceHistory
{
    public class CarInsuranceHistoryParameterValidator : AbstractValidator<CarInsuranceHistoryParameter>
    {
        public CarInsuranceHistoryParameterValidator()
        {
          
        }
    }
}
