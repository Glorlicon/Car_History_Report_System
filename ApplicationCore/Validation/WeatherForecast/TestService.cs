using Application.Exceptions;
using CarHistoryReportSystemAPI;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validation.WeatherForecast
{
    public static class TestService
    {

        public static bool TestWeather(WeatherForecastTwo weather)
        {
            var validator = new WeatherForecastValidator();
            validator.ValidateAndThrow(weather);
            return true;
        }
    }
}
