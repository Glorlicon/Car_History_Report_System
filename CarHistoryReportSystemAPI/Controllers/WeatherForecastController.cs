using Application.Interfaces;
using Application.Validation.WeatherForecast;
using CarHistoryReportSystemAPI.Resources;
using Domain.Entities;
using FluentValidation;
using Infrastructure.Configurations.EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailServices _emailServices;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public WeatherForecastController(ILogger<WeatherForecastController> logger,IEmailServices emailServices, IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _logger = logger;
            _emailServices = emailServices;
            _unitOfWork = unitOfWork;
            _sharedLocalizer = sharedLocalizer;
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

        [HttpGet("localized")]
        public async Task<IActionResult> TestLocalize(string test)
        {
            var carId = "abc";
            var input = $"Car Model with id {carId} was not found";
            var list = _sharedLocalizer.GetAllStrings();
            foreach (var er in list)
            {
                Console.WriteLine(er.Name);
                Console.WriteLine(er.Value);
            }
            return Ok(_sharedLocalizer["Car Model with id {0} was not found",123]);
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

        [HttpGet("test-unit-of-work")]
        public async Task<IActionResult> TestUnitOfWork()
        {
            CarSpecification carSpec = new CarSpecification
            {
                ModelID = "TestUOW_2",
                ReleasedDate = DateOnly.FromDateTime(DateTime.Today),
                Country = "VN",
                FuelType = Domain.Enum.FuelType.Gasoline,
                BodyType = Domain.Enum.BodyType.SUV,

            };
            DataProvider dataProvider = new DataProvider
            {
                Id = 0,
                Name = "TestUOW_2",
                Description = "TestUOW",
                Type = Domain.Enum.DataProviderType.CarDealer
            };
            _unitOfWork.CarSpecificationRepository.Create(carSpec);
            throw new Exception("Interrupt");
            _unitOfWork.DataProviderRepository.Create(dataProvider);
            await _unitOfWork.SaveAsync();
            return Ok(new {carSpecId = carSpec.ModelID, dataProviderId = dataProvider.Id});
        }
    }
}