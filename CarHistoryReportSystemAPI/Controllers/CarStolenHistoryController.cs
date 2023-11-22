using Application.Common.Models;
using Application.DTO.CarStolenHistory;
using Application.DTO.CarStolenHistory;
using Application.Interfaces;
using Application.Validation;
using Application.Validation.CarStolenHistory;
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
        private readonly ICarHistoryServices<CarStolenHistoryResponseDTO,
                                             CarStolenHistoryParameter,
                                             CarStolenHistoryCreateRequestDTO,
                                             CarStolenHistoryUpdateRequestDTO> _carStolenHistoryService;
        private readonly ICsvServices _csvServices;

        public CarStolenHistoryController(ICarHistoryServices<CarStolenHistoryResponseDTO,
                                                             CarStolenHistoryParameter,
                                                             CarStolenHistoryCreateRequestDTO,
                                                             CarStolenHistoryUpdateRequestDTO> carStolenHistoryService
                                        , ICsvServices csvServices)
        {
            _carStolenHistoryService = carStolenHistoryService;
            _csvServices = csvServices;
        }

        /// <summary>
        /// Get All Car Stolen Historys
        /// </summary>
        /// <returns>Car Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<CarStolenHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistorysAsync([FromQuery] CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _carStolenHistoryService.GetAllCarHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carStolenHistorys.PagingData));
            return Ok(carStolenHistorys);
        }

        /// <summary>
        /// Get Car Stolen History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Stolen History</returns>
        [HttpGet("{id}", Name = "GetCarStolenHistory")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(CarStolenHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarStolenHistoryAsync(int id)
        {
            var carStolenHistory = await _carStolenHistoryService.GetCarHistory(id);
            return Ok(carStolenHistory);
        }

        /// <summary>
        /// Get All Car Stolen Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Stolen History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<CarStolenHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistoryByCarIdAsync(string vinId, [FromQuery] CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _carStolenHistoryService.GetCarHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carStolenHistorys.PagingData));
            return Ok(carStolenHistorys);
        }

        /// <summary>
        /// Get All Car Stolen Historys created by userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Stolen History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<CarStolenHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistoryByUserIdAsync(string userId, [FromQuery] CarStolenHistoryParameter parameter)
        {
            var carStolenHistorys = await _carStolenHistoryService.GetCarHistoryByUserId(userId, parameter);
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
        /// <response code="404">Car not found</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarStolenHistory")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
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
            await _carStolenHistoryService.CreateCarHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Create Car Stolen History collection
        /// </summary>
        /// <param name="requests"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("collection")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarStolenHistoryCollectionAsync([FromBody] IEnumerable<CarStolenHistoryCreateRequestDTO> requests)
        {
            CarStolenHistoryCreateRequestDTOValidator validator = new CarStolenHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carStolenHistoryService.CreateCarHistoryCollection(requests);
            return NoContent();
        }

        /// <summary>
        /// Create Car Stolen History from csv file
        /// </summary>
        /// <param name="file">Only upload 1 file csv</param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("collection/from-csv")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarStolenHistoryCollectionFromCsvAsync([FromForm] IFormFileCollection file)
        {
            if (file.Count != 1)
            {
                return BadRequest(new ErrorDetails("You should upload 1 file only"));
            }
            var requests = _csvServices.ConvertToListObject<CarStolenHistoryCreateRequestDTO>(file[0].OpenReadStream());
            //validate
            CarStolenHistoryCreateRequestDTOValidator validator = new CarStolenHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carStolenHistoryService.CreateCarHistoryCollection(requests);
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
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
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
            await _carStolenHistoryService.UpdateCarHistory(id, request);
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
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarHistoryAsync(int id)
        {
            await _carStolenHistoryService.DeleteCarHistory(id);
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
            var carStolenHistorys = await _carStolenHistoryService.InsuranceCompanyGetOwnCarHistories(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carStolenHistorys.PagingData));
            return Ok(carStolenHistorys);
        }

        /// <summary>
        /// Get Car Stolen History detail by own insurance company
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Stolen History Detail</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("insurance-own/{id}")]
        [Authorize(Roles = "InsuranceCompany")]
        [ProducesResponseType(typeof(CarStolenHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarStolenHistoryByIdAsync(int id)
        {
            var carStolenHistory = await _carStolenHistoryService.InsuranceCompanyGetOwnCarHistoryDetail(id);
            return Ok(carStolenHistory);
        }
    }
}
