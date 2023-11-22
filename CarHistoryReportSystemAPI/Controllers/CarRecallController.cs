using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarRecall;
using Application.Interfaces;
using Application.Validation.Car;
using Application.Validation.CarRecall;
using CarHistoryReportSystemAPI.Resources;
using Domain.Entities;
using Domain.Enum;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarRecallController : ControllerBase
    {
        private readonly ICarRecallServices _carRecallService;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public CarRecallController(ICarRecallServices carRecallService, IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _carRecallService = carRecallService;
            _sharedLocalizer = sharedLocalizer;
        }

        /// <summary>
        /// Get All Car Recalls
        /// </summary>
        /// <returns>Car Recall List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<CarRecallResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRecallsAsync([FromQuery] CarRecallParameter parameter)
        {
            var carRecalls = await _carRecallService.GetAllCarRecalls(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRecalls.PagingData));
            return Ok(carRecalls);
        }

        /// <summary>
        /// Get All Car Recalls by manufacturer
        /// </summary>
        /// <param name="manufacturerId"></param>
        /// <returns>Car Recall List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("manufacturer/{manufacturerId}")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<CarRecallResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRecallsByManufacturer(int manufacturerId, [FromQuery] CarRecallParameter parameter)
        {
            var carRecalls = await _carRecallService.GetCarRecallsByManufacturer(manufacturerId,parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRecalls.PagingData));
            return Ok(carRecalls);
        }

        /// <summary>
        /// Get All Car Recalls by Model
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns>Car Recall List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("model/{modelId}")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<CarRecallResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRecallsByModel(string modelId, [FromQuery] CarRecallParameter parameter)
        {
            var carRecalls = await _carRecallService.GetCarRecallsByModel(modelId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carRecalls.PagingData));
            return Ok(carRecalls);
        }

        /// <summary>
        /// Get Car Recall By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Recall</returns>
        /// <response code="404">Car Recall Not Found</response>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(CarResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarRecall(int id)
        {
            var carRecall = await _carRecallService.GetCarRecall(id);
            return Ok(carRecall);
        }

        /// <summary>
        /// Create car recall
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarRecallAsync([FromBody] CarRecallCreateRequestDTO request)
        {
            await _carRecallService.CreateCarRecall(request);
            return NoContent();
        }

        /// <summary>
        /// Update Car Recall
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car recall not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarRecallAsync(int id, [FromBody] CarRecallUpdateRequestDTO request)
        {
            await _carRecallService.UpdateCarRecall(id, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car Recall
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car recall not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarRecallAsync(int id)
        {
            await _carRecallService.DeleteCarRecall(id);
            return NoContent();
        }

        /// <summary>
        /// Get All Car Recalls Status by Car
        /// </summary>
        /// <param name="vinId"></param>
        /// <param name="parameter">Status should be Open or Closed</param>
        /// <returns>Car Recall Status List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("status/car/{vinId}")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<CarRecallResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarRecallStatusesByCar(string vinId, [FromQuery] CarRecallStatusParameter parameter)
        {
            CarRecallStatusParameterValidator validator = new CarRecallStatusParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            var carRecallStatuses = await _carRecallService.GetCarRecallStatusByCar(vinId, parameter);
            return Ok(carRecallStatuses);
        }

        /// <summary>
        /// Get Car Recall Status By Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <param name="recallId"></param>
        /// <returns>Car Recall Status</returns>
        /// <response code="404">Car Recall Status Not Found</response>
        [HttpGet("status/{vinId}/{recallId}")]
        [Authorize]
        [ProducesResponseType(typeof(CarResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails),StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarRecallStatus(string vinId, int recallId)
        {
            var carRecall = await _carRecallService.GetCarRecallStatus(recallId, vinId);
            return Ok(carRecall);
        }

        /// <summary>
        /// Update Car Recall Status
        /// </summary>
        /// <param name="vinId"></param>
        /// <param name="recallId"></param>
        /// <param name="request">Status should be 0 for open and 1 for closed</param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car recall status not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("status/{vinId}/{recallId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer,ServiceShop")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarRecallStatusAsync(string vinId, int recallId, [FromBody] CarRecallStatusUpdateRequestDTO request)
        {
            await _carRecallService.UpdateCarRecallStatus(recallId, vinId, request);
            return NoContent();
        }

    }
}
