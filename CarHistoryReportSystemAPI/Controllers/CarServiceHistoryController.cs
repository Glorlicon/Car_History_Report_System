using Application.Common.Models;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Application.Validation;
using Application.Validation.Car;
using Application.Validation.CarServiceHistory;
using Domain.Entities;
using Domain.Enum;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarServiceHistoryController : ControllerBase
    {
        private readonly ICarHistoryServices<CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO> _carServiceHistoryService;
        private readonly ICsvServices _csvServices;

        public CarServiceHistoryController(ICarHistoryServices<CarServiceHistoryResponseDTO,
                                                             CarServiceHistoryParameter,
                                                             CarServiceHistoryCreateRequestDTO,
                                                             CarServiceHistoryUpdateRequestDTO> carServiceHistoryService
                                        , ICsvServices csvServices)
        {
            _carServiceHistoryService = carServiceHistoryService;
            _csvServices = csvServices;
        }

        /// <summary>
        /// Get All Car Service Historys
        /// </summary>
        /// <returns>Car Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CarServiceHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails),StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarServiceHistorysAsync([FromQuery] CarServiceHistoryParameter parameter)
        {
            var carServiceHistorys = await _carServiceHistoryService.GetAllCarHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carServiceHistorys.PagingData));
            return Ok(carServiceHistorys);
        }

        /// <summary>
        /// Get Car Service History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Service History</returns>
        [HttpGet("{id}", Name = "GetCarServiceHistory")]
        [ProducesResponseType(typeof(CarServiceHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails),StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarServiceHistoryAsync(int id)
        {
            var carServiceHistory = await _carServiceHistoryService.GetCarHistory(id);
            return Ok(carServiceHistory);
        }

        /// <summary>
        /// Get All Car Service Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Service History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}")]
        [ProducesResponseType(typeof(IEnumerable<CarServiceHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails),StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarServiceHistoryByCarIdAsync(string vinId, [FromQuery] CarServiceHistoryParameter parameter)
        {
            var carServiceHistorys = await _carServiceHistoryService.GetCarHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carServiceHistorys.PagingData));
            return Ok(carServiceHistorys);
        }

        /// <summary>
        /// Get All Car Service Historys created by userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Service History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<CarServiceHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarServiceHistoryByUserIdAsync(string userId, [FromQuery] CarServiceHistoryParameter parameter)
        {
            var carServiceHistorys = await _carServiceHistoryService.GetCarHistoryByUserId(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carServiceHistorys.PagingData));
            return Ok(carServiceHistorys);
        }

        /// <summary>
        /// Create Car Service History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarServiceHistory")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarServiceHistoryAsync([FromBody] CarServiceHistoryCreateRequestDTO request)
        {
            CarServiceHistoryCreateRequestDTOValidator validator = new CarServiceHistoryCreateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            await _carServiceHistoryService.CreateCarHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Create Car Service History collection
        /// </summary>
        /// <param name="requests"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("collection")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarServiceHistoryCollectionAsync([FromBody] IEnumerable<CarServiceHistoryCreateRequestDTO> requests)
        {
            CarServiceHistoryCreateRequestDTOValidator validator = new CarServiceHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if(errors.Error.Count > 0) return BadRequest(errors);
            await _carServiceHistoryService.CreateCarHistoryCollection(requests);
            return NoContent();
        }

        /// <summary>
        /// Create Car Service History from csv file
        /// </summary>
        /// <param name="file">Only upload 1 file csv</param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("collection/from-csv")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarServiceHistoryCollectionFromCsvAsync([FromForm] IFormFileCollection file)
        {
            if(file.Count != 1)
            {
                return BadRequest(new ErrorDetails("You should upload 1 file only"));
            }
            var requests = _csvServices.ConvertToListObject<CarServiceHistoryCreateRequestDTO>(file[0].OpenReadStream());
            //validate
            CarServiceHistoryCreateRequestDTOValidator validator = new CarServiceHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carServiceHistoryService.CreateCarHistoryCollection(requests);
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
        public async Task<IActionResult> UpdateCarServiceHistoryAsync(int id, [FromBody] CarServiceHistoryUpdateRequestDTO request)
        {
            CarServiceHistoryUpdateRequestDTOValidator validator = new CarServiceHistoryUpdateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach(var error in validationResult.Errors)
                {
                    errors.Error.Add(error.ErrorMessage);
                }
                return BadRequest(errors);
            }
            await _carServiceHistoryService.UpdateCarHistory(id, request);
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
            await _carServiceHistoryService.DeleteCarHistory(id);
            return NoContent();
        }

        /// <summary>
        /// Get All Car Service History's Service
        /// </summary>
        /// <returns>Car's Service History List</returns>
        [HttpGet("service-list")]
        public IActionResult GetCarServiceTypeList()
        {
            var listTypes = Enum.GetNames(typeof(CarServiceType));
            var serviceTypes = listTypes.Select(x => new
            {
                name = x,
                value = Enum.Parse(typeof(CarServiceType), x)
            });
            return Ok(serviceTypes);
        }
    }
}
