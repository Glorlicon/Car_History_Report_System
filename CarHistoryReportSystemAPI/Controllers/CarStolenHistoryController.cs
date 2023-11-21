using Application.Common.Models;
using Application.DTO.CarStolenHistory;
using Application.Interfaces;
using Application.Validation.CarStolenHistory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{  
    [Route("api/[controller]")]
    [ApiController]
    public class CarStolenHistoryController : ControllerBase
    {
        private readonly ICarStolenHistoryServices _carStolenHistoryService;

        public CarStolenHistoryController(ICarStolenHistoryServices carStolenHistoryService)
        {
            _carStolenHistoryService = carStolenHistoryService;
        }

        /// <summary>
        /// Get All Car Stolen Historys
        /// </summary>
        /// <returns>Car Stolen Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet(Name = "GetCarStolenHistorys")]
        [ProducesResponseType(typeof(IEnumerable<CarStolenHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistorysAsync([FromQuery] CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _carStolenHistoryService.GetAllCarStolenHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carStolenHistorys.PagingData));
            return Ok(carStolenHistorys);
        }

        /// <summary>
        /// Get Car Stolen History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Stolen History</returns>
        [HttpGet("{id}", Name = "GetCarStolenHistory")]
        [ProducesResponseType(typeof(CarStolenHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarStolenHistoryAsync(int id)
        {
            var carStolenHistory = await _carStolenHistoryService.GetCarStolenHistory(id);
            return Ok(carStolenHistory);
        }        

        /// <summary>
        /// Get Current Car Stolen
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Stolen History</returns>
        [HttpGet("car/{vinId}/current", Name = "GetCurrentCarStolen")]
        [ProducesResponseType(typeof(CarStolenHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCurrentCarStolenHistoryAsync(string vinId)
        {
            var carStolenHistory = await _carStolenHistoryService.GetCurrentCarStolen(vinId);
            return Ok(carStolenHistory);
        }

        /// <summary>
        /// Get All Car Stolen Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}", Name = "GetCarStolenHistoryByCarId")]
        [ProducesResponseType(typeof(IEnumerable<CarStolenHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistoryByCarIdAsync(string vinId, [FromQuery] CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _carStolenHistoryService.GetCarStolenHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carStolenHistorys.PagingData));
            return Ok(carStolenHistorys);
        }        

        /// <summary>
        /// Create Car Stolen History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarStolenHistory")]
        [Authorize(Roles = "PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarStolenHistoryAsync([FromBody] CarStolenHistoryCreateRequestDTO request)
        {
            CarStolenHistoryCreateRequestDTOValidator validator = new CarStolenHistoryCreateRequestDTOValidator();
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
            var result = await _carStolenHistoryService.CreateCarStolenHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Update Car Stolen History
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car Stolen History not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarStolenHistoryAsync(int id, [FromBody] CarStolenHistoryUpdateRequestDTO request)
        {
            CarStolenHistoryUpdateRequestDTOValidator validator = new CarStolenHistoryUpdateRequestDTOValidator();
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
            var result = await _carStolenHistoryService.UpdateCarStolenHistory(id, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car Stolen History
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car Stolen History not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarAsync(int id)
        {
            var result = await _carStolenHistoryService.DeleteCarStolenHistory(id);
            return NoContent();
        }

        /// <summary>
        /// Get All Car Stolen Historys of Insurance Own Company
        /// </summary>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("insurance-own", Name = "GetCarStolenHistorysByOwnInsuranceCompany")]
        [Authorize(Roles = "InsuranceCompany")]
        [ProducesResponseType(typeof(IEnumerable<CarStolenHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistorysByOwnInsuranceCompany([FromQuery] CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _carStolenHistoryService.InsuranceCompanyGetOwnCarStolenHistories(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carStolenHistorys.PagingData));
            return Ok(carStolenHistorys);
        }

        /// <summary>
        /// Get Car Stolen History By id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Stolen History</returns>
        [HttpGet("insurance-own/{id}", Name = "GetCarStolenHistoryByOwnInsuranceCompany")]
        [Authorize(Roles = "InsuranceCompany")]
        [ProducesResponseType(typeof(CarStolenHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarStolenHistoryByOwnInsuranceCompany(int id)
        {
            var carStolenHistory = await _carStolenHistoryService.InsuranceCompanyGetOwnCarStolenHistoryDetail(id);
            return Ok(carStolenHistory);
        }
    }
}
