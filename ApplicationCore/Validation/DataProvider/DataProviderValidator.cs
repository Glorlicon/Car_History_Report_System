using Application.DTO.DataProvider;
using Application.DTO.Request;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.DataProvider
{
    public class DataProviderValidator : AbstractValidator<DataProviderWorkingTimesCreateRequestDTO>
    {
        public DataProviderValidator()
        {
            if (RuleFor(x => x.StartHour).Empty().Equals(true)
                && RuleFor(x => x.StartHour).Empty().Equals(true)
                && RuleFor(x => x.StartHour).Empty().Equals(true)
                    && RuleFor(x => x.StartHour).Empty().Equals(true))
            {
                RuleFor(x => x.IsClosed).Equals(true);
            }
            else
            {
                RuleFor(x => x.DayOfWeek).InclusiveBetween(0, 6).WithMessage("Day of week can only be in range of [0,6] (0 equal Sunday)");
                RuleFor(x => x.StartHour).InclusiveBetween(0, 23).WithMessage("Hour can only be in range of [0,23] ");
                RuleFor(x => x.StartMinute).InclusiveBetween(0, 59).WithMessage("Minute can only be in range of [0,59]");
                RuleFor(x => x.EndHour).InclusiveBetween(0, 23).WithMessage("Hour can only be in range of [0,23]");
                RuleFor(x => x.EndMinute).InclusiveBetween(0, 59).WithMessage("Minute can only be in range of [0,59]");
                RuleFor(x => x.IsClosed).Equals(false);
            }
        }
    }
}
