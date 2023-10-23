using Application.DTO.Car;
using Application.DTO.DataProvider;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.DataProvider
{
    public class DataProviderParameterValidator : AbstractValidator<DataProviderParameter>
    {
        public DataProviderParameterValidator()
        {
            RuleFor(x => x.Type).IsInEnum().WithMessage("Type can only be in range of [0,5]"); ;
        }
    }
}
