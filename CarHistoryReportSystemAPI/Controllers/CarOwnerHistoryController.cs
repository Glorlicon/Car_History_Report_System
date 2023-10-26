using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.Interfaces;
using Application.Validation.Car;
using Application.Validation.CarOwnerHistory;
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
    public class CarOwnerHistoryController : ControllerBase
    {
        private readonly ICarOwnerHistoryServices _carOwnerHistoryService;

        public CarOwnerHistoryController(ICarOwnerHistoryServices carOwnerHistoryService)
        {
            _carOwnerHistoryService = carOwnerHistoryService;
        }

        /// <summary>
        /// Get All Car Owner Historys
        /// </summary>
        /// <returns>Car Owner Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet(Name = "GetCarOwnerHistorys")]
        [ProducesResponseType(typeof(IEnumerable<CarOwnerHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarOwnerHistorysAsync([FromQuery] CarOwnerHistoryParameter parameter)
        {
            var carOwnerHistorys = await _carOwnerHistoryService.GetAllCarOwnerHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carOwnerHistorys.PagingData));
            return Ok(carOwnerHistorys);
        }

        /// <summary>
        /// Get Car Owner History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Owner History</returns>
        [HttpGet("{id}", Name = "GetCarOwnerHistory")]
        [ProducesResponseType(typeof(CarOwnerHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarOwnerHistoryAsync(int id)
        {
            var carOwnerHistory = await _carOwnerHistoryService.GetCarOwnerHistory(id);
            return Ok(carOwnerHistory);
        }

        /// <summary>
        /// Get Current Car Owner
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Owner History</returns>
        [HttpGet("car/{vinId}/current", Name = "GetCurrentCarOwner")]
        [ProducesResponseType(typeof(CarOwnerHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCurrentCarOwnerHistoryAsync(string vinId)
        {
            var carOwnerHistory = await _carOwnerHistoryService.GetCurrentCarOwner(vinId);
            return Ok(carOwnerHistory);
        }

        /// <summary>
        /// Get All Car Owner Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}", Name = "GetCarOwnerHistoryByCarId")]
        [ProducesResponseType(typeof(IEnumerable<CarOwnerHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarOwnerHistoryByCarIdAsync(string vinId, [FromQuery] CarOwnerHistoryParameter parameter)
        {
            var carOwnerHistorys = await _carOwnerHistoryService.GetCarOwnerHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carOwnerHistorys.PagingData));
            return Ok(carOwnerHistorys);
        }

        /// <summary>
        /// Create Car Owner History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarOwnerHistory")]
        [Authorize(Roles = "CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarOwnerHistoryAsync([FromBody] CarOwnerHistoryCreateRequestDTO request)
        {
            CarOwnerHistoryCreateRequestDTOValidator validator = new CarOwnerHistoryCreateRequestDTOValidator();
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
            var result = await _carOwnerHistoryService.CreateCarOwnerHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Update Car Owner History
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car Owner History not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarOwnerHistoryAsync(int id, [FromBody] CarOwnerHistoryUpdateRequestDTO request)
        {
            CarOwnerHistoryUpdateRequestDTOValidator validator = new CarOwnerHistoryUpdateRequestDTOValidator();
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
            var result = await _carOwnerHistoryService.UpdateCarOwnerHistory(id, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car Owner History
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car Owner History not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarAsync(int id)
        {
            var result = await _carOwnerHistoryService.DeleteCarOwnerHistory(id);
            return NoContent();
        }
    }
}
