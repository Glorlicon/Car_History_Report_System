using Application.DTO.Car;
using Application.DTO.DataProvider;
using Domain.Enum;
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
            RuleFor(x => x.Type).IsInEnum().WithMessage("Type can only be in range of [0,5]");
            RuleFor(x => x.SortByName).InclusiveBetween(-1, 1).WithMessage("Can only be -1 for descending, 1 for ascending, 0 for not sorting");
        }
    }
}
