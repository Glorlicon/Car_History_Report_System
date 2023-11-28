using Application.Common.Models;
using Application.DTO.CarAccidentHistory;
using Application.DTO.CarRegistrationHistory;
using Application.Interfaces;
using Application.Validation;
using Application.Validation.CarRegistrationHistory;
using CarHistoryReportSystemAPI.Resources;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarRegistrationHistoryController : ControllerBase
    {
        private readonly ICarHistoryServices<CarRegistrationHistoryResponseDTO,
                                             CarRegistrationHistoryParameter,
                                             CarRegistrationHistoryCreateRequestDTO,
                                             CarRegistrationHistoryUpdateRequestDTO> _carRegistrationHistoryService;
        private readonly ICsvServices _csvServices;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public CarRegistrationHistoryController(ICarHistoryServices<CarRegistrationHistoryResponseDTO,
                                                             CarRegistrationHistoryParameter,
                                                             CarRegistrationHistoryCreateRequestDTO,
                                                             CarRegistrationHistoryUpdateRequestDTO> carRegistrationHistoryService
                                        , ICsvServices csvServices
                                        , IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _carRegistrationHistoryService = carRegistrationHistoryService;
            _csvServices = csvServices;
            _sharedLocalizer = sharedLocalizer;
        }

        /// <summary>
        /// Get All Car Registration Historys
        /// </summary>
        /// <returns>Car Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CarRegistrationHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRegistrationHistorysAsync([FromQuery] CarRegistrationHistoryParameter parameter)
        {
            var carRegistrationHistorys = await _carRegistrationHistoryService.GetAllCarHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRegistrationHistorys.PagingData));
            return Ok(carRegistrationHistorys);
        }

        /// <summary>
        /// Get Car Registration History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Registration History</returns>
        [HttpGet("{id}", Name = "GetCarRegistrationHistory")]
        [ProducesResponseType(typeof(CarRegistrationHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarRegistrationHistoryAsync(int id)
        {
            var carRegistrationHistory = await _carRegistrationHistoryService.GetCarHistory(id);
            return Ok(carRegistrationHistory);
        }

        /// <summary>
        /// Get All Car Registration Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Registration History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}")]
        [ProducesResponseType(typeof(IEnumerable<CarRegistrationHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRegistrationHistoryByCarIdAsync(string vinId, [FromQuery] CarRegistrationHistoryParameter parameter)
        {
            var carRegistrationHistorys = await _carRegistrationHistoryService.GetCarHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRegistrationHistorys.PagingData));
            return Ok(carRegistrationHistorys);
        }

        /// <summary>
        /// Get All Car Registration Historys created by userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Registration History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<CarRegistrationHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRegistrationHistoryByUserIdAsync(string userId, [FromQuery] CarRegistrationHistoryParameter parameter)
        {
            var carRegistrationHistorys = await _carRegistrationHistoryService.GetCarHistoryByUserId(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRegistrationHistorys.PagingData));
            return Ok(carRegistrationHistorys);
        }

        /// <summary>
        /// Get All Car Registration Historys created by dataProviderId
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns>Car Registration History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("data-provider/{dataProviderId}")]
        [ProducesResponseType(typeof(IEnumerable<CarRegistrationHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRegistrationHistoryByDataProviderIdAsync(int dataProviderId, [FromQuery] CarRegistrationHistoryParameter parameter)
        {
            var carRegistrationHistorys = await _carRegistrationHistoryService.GetCarHistoryByDataProviderId(dataProviderId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRegistrationHistorys.PagingData));
            return Ok(carRegistrationHistorys);
        }

        /// <summary>
        /// Create Car Registration History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car not found</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarRegistrationHistory")]
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarRegistrationHistoryAsync([FromBody] CarRegistrationHistoryCreateRequestDTO request)
        {
            CarRegistrationHistoryCreateRequestDTOValidator validator = new CarRegistrationHistoryCreateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            await _carRegistrationHistoryService.CreateCarHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Create Car Registration History collection
        /// </summary>
        /// <param name="requests"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("collection")]
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarRegistrationHistoryCollectionAsync([FromBody] IEnumerable<CarRegistrationHistoryCreateRequestDTO> requests)
        {
            CarRegistrationHistoryCreateRequestDTOValidator validator = new CarRegistrationHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carRegistrationHistoryService.CreateCarHistoryCollection(requests);
            return NoContent();
        }

        /// <summary>
        /// Create Car Registration History from csv file
        /// </summary>
        /// <param name="file">Only upload 1 file csv</param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("collection/from-csv")]
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarRegistrationHistoryCollectionFromCsvAsync([FromForm] IFormFileCollection file)
        {
            if (file.Count != 1)
            {
                return BadRequest(new ErrorDetails(_sharedLocalizer["You should upload 1 file only"]));
            }
            var requests = _csvServices.ConvertToListObject<CarRegistrationHistoryCreateRequestDTO>(file[0].OpenReadStream());
            //validate
            CarRegistrationHistoryCreateRequestDTOValidator validator = new CarRegistrationHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carRegistrationHistoryService.CreateCarHistoryCollection(requests);
            return NoContent();
        }

        /// <summary>
        /// Update Car History
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car History not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarRegistrationHistoryAsync(int id, [FromBody] CarRegistrationHistoryUpdateRequestDTO request)
        {
            CarRegistrationHistoryUpdateRequestDTOValidator validator = new CarRegistrationHistoryUpdateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            await _carRegistrationHistoryService.UpdateCarHistory(id, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car History
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car History not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarHistoryAsync(int id)
        {
            await _carRegistrationHistoryService.DeleteCarHistory(id);
            return NoContent();
        }

        /// <summary>
        /// Get Car Historys Create Form Csv
        /// </summary>
        /// <returns>Car Historys List</returns>
        [HttpGet("collection/from-csv/form")]
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        public async Task<IActionResult> GetCreateFormCarHistorysAsync()
        {
            var carHistorys = new List<CarRegistrationHistoryCreateRequestDTO>
            {
                new CarRegistrationHistoryCreateRequestDTO
                {
                    CarId = "Example",
                    Note = "None",
                    Odometer = null,
                    ReportDate = DateOnly.FromDateTime(DateTime.Now),
                    ExpireDate = DateOnly.FromDateTime(DateTime.Now),
                    LicensePlateNumber = "12A-12345",
                    OwnerName = "Nguyen Van A",
                    RegistrationNumber = "A12345"
                }
            };
            Request.Headers.Accept = "text/csv";
            return Ok(carHistorys);
        }
    }
}
