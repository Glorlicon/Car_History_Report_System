using CarHistoryReportSystemAPI;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.WeatherForecast
{
    public class WeatherForecastValidator : AbstractValidator<WeatherForecastTwo>
    {
        public WeatherForecastValidator()
        {
            RuleFor(model => model.TemperatureC)
                .LessThanOrEqualTo(100);
            RuleFor(model => model.Summary)
                .NotEmpty();
        }
    }
}
