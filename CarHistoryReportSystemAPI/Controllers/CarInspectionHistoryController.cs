using Application.Common.Models;
using Application.DTO.CarInspectionHistory;
using Application.Interfaces;
using Application.Validation;
using Application.Validation.CarInspectionHistory;
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
    public class CarInspectionHistoryController : ControllerBase
    {
        private readonly ICarHistoryServices<CarInspectionHistoryResponseDTO,
                                             CarInspectionHistoryParameter,
                                             CarInspectionHistoryCreateRequestDTO,
                                             CarInspectionHistoryUpdateRequestDTO> _carInspectionHistoryService;
        private readonly ICsvServices _csvServices;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public CarInspectionHistoryController(ICarHistoryServices<CarInspectionHistoryResponseDTO,
                                                             CarInspectionHistoryParameter,
                                                             CarInspectionHistoryCreateRequestDTO,
                                                             CarInspectionHistoryUpdateRequestDTO> carInspectionHistoryService
                                        , ICsvServices csvServices
                                        , IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _carInspectionHistoryService = carInspectionHistoryService;
            _csvServices = csvServices;
            _sharedLocalizer = sharedLocalizer;
        }

        /// <summary>
        /// Get All Car Inspection Historys
        /// </summary>
        /// <returns>Car Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CarInspectionHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInspectionHistorysAsync([FromQuery] CarInspectionHistoryParameter parameter)
        {
            var carInspectionHistorys = await _carInspectionHistoryService.GetAllCarHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInspectionHistorys.PagingData));
            return Ok(carInspectionHistorys);
        }

        /// <summary>
        /// Get Car Inspection History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Inspection History</returns>
        [HttpGet("{id}", Name = "GetCarInspectionHistory")]
        [ProducesResponseType(typeof(CarInspectionHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarInspectionHistoryAsync(int id)
        {
            var carInspectionHistory = await _carInspectionHistoryService.GetCarHistory(id);
            return Ok(carInspectionHistory);
        }

        /// <summary>
        /// Get All Car Inspection Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Inspection History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}")]
        [ProducesResponseType(typeof(IEnumerable<CarInspectionHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInspectionHistoryByCarIdAsync(string vinId, [FromQuery] CarInspectionHistoryParameter parameter)
        {
            var carInspectionHistorys = await _carInspectionHistoryService.GetCarHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInspectionHistorys.PagingData));
            return Ok(carInspectionHistorys);
        }

        /// <summary>
        /// Get All Car Inspection Historys created by userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Inspection History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<CarInspectionHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInspectionHistoryByUserIdAsync(string userId, [FromQuery] CarInspectionHistoryParameter parameter)
        {
            var carInspectionHistorys = await _carInspectionHistoryService.GetCarHistoryByUserId(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInspectionHistorys.PagingData));
            return Ok(carInspectionHistorys);
        }

        /// <summary>
        /// Get All Car Inspection Historys created by dataProviderId
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns>Car Inspection History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("data-provider/{dataProviderId}")]
        [ProducesResponseType(typeof(IEnumerable<CarInspectionHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInspectionHistoryByDataProviderAsync(int dataProviderId, [FromQuery] CarInspectionHistoryParameter parameter)
        {
            var carInspectionHistorys = await _carInspectionHistoryService.GetCarHistoryByDataProviderId(dataProviderId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInspectionHistorys.PagingData));
            return Ok(carInspectionHistorys);
        }

        /// <summary>
        /// Create Car Inspection History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car not found</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarInspectionHistory")]
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarInspectionHistoryAsync([FromBody] CarInspectionHistoryCreateRequestDTO request)
        {
            CarInspectionHistoryCreateRequestDTOValidator validator = new CarInspectionHistoryCreateRequestDTOValidator();
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
            await _carInspectionHistoryService.CreateCarHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Create Car Inspection History collection
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
        public async Task<IActionResult> CreateCarInspectionHistoryCollectionAsync([FromBody] IEnumerable<CarInspectionHistoryCreateRequestDTO> requests)
        {
            CarInspectionHistoryCreateRequestDTOValidator validator = new CarInspectionHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carInspectionHistoryService.CreateCarHistoryCollection(requests);
            return NoContent();
        }

        /// <summary>
        /// Create Car Inspection History from csv file
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
        public async Task<IActionResult> CreateCarInspectionHistoryCollectionFromCsvAsync([FromForm] IFormFileCollection file)
        {
            if (file.Count != 1)
            {
                return BadRequest(new ErrorDetails(_sharedLocalizer["You should upload 1 file only"]));
            }
            var requests = _csvServices.ConvertToListObject<CarInspectionHistoryCreateRequestDTO>(file[0].OpenReadStream());
            //validate
            CarInspectionHistoryCreateRequestDTOValidator validator = new CarInspectionHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carInspectionHistoryService.CreateCarHistoryCollection(requests);
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
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarInspectionHistoryAsync(int id, [FromBody] CarInspectionHistoryUpdateRequestDTO request)
        {
            CarInspectionHistoryUpdateRequestDTOValidator validator = new CarInspectionHistoryUpdateRequestDTOValidator();
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
            await _carInspectionHistoryService.UpdateCarHistory(id, request);
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
        [Authorize(Roles = "Adminstrator,VehicleRegistry")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarHistoryAsync(int id)
        {
            await _carInspectionHistoryService.DeleteCarHistory(id);
            return NoContent();
        }
    }
}
