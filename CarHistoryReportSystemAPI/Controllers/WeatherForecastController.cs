using Application.Interfaces;
using Application.Validation.WeatherForecast;
using FluentValidation;
using Infrastructure.Configurations.EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit.Cryptography;

namespace CarHistoryReportSystemAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IEmailServices _emailServices;

        public WeatherForecastController(ILogger<WeatherForecastController> logger,IEmailServices emailServices)
        {
            _logger = logger;
            _emailServices = emailServices;
        }

        [Authorize]
        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Authorize(Roles = "Adminstrator")]
        [HttpGet("GetWeatherForecastAdminstrator")]
        public IEnumerable<WeatherForecast> GetAdminstrator()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Authorize(Roles = "User")]
        [HttpGet("GetWeatherForecastUser")]
        public IEnumerable<WeatherForecast> GetUser()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [Authorize(Roles = "CarDealer")]
        [HttpGet("GetWeatherForecastCarDealer")]
        public IEnumerable<WeatherForecast> GetCarDealer()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("Email")]
        public async Task<IEnumerable<WeatherForecast>> SendEmail()
        {
            await _emailServices.SendEmailAsync(new string[] { "linhnvhdev@gmail.com" }, "Test email", "This is the content from our email.");
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpPost]
        public ActionResult Post([FromBody] WeatherForecastTwo forecast)
        {
            try
            {
                TestService.TestWeather(forecast);
            }
            catch(ValidationException ex)
            {
                foreach(var error in ex.Errors)
                {
                    ModelState.TryAddModelError(error.ErrorCode, error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }
            return Ok("Success!");
        }

        [HttpGet("exception",Name = "GetException")]
        public IEnumerable<WeatherForecast> GetException()
        {
            throw new DbUpdateException("Random Exception");
        }
    }
}