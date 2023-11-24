using Application.Common.Models;
using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInsurance;
using Application.Interfaces;
using Application.Validation;
using Application.Validation.CarInsuranceHistory;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarInsuranceController : ControllerBase
    {
        private readonly ICarHistoryServices<CarInsuranceHistoryResponseDTO,
                                             CarInsuranceHistoryParameter,
                                             CarInsuranceHistoryCreateRequestDTO,
                                             CarInsuranceHistoryUpdateRequestDTO> _carInsuranceHistoryService;
        private readonly ICsvServices _csvServices;

        public CarInsuranceController(ICarHistoryServices<CarInsuranceHistoryResponseDTO,
                                                             CarInsuranceHistoryParameter,
                                                             CarInsuranceHistoryCreateRequestDTO,
                                                             CarInsuranceHistoryUpdateRequestDTO> carInsuranceHistoryService
                                        , ICsvServices csvServices)
        {
            _carInsuranceHistoryService = carInsuranceHistoryService;
            _csvServices = csvServices;
        }

        /// <summary>
        /// Get All Car Service Historys
        /// </summary>
        /// <returns>Car Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(typeof(IEnumerable<CarInsuranceHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInsuranceHistorysAsync([FromQuery] CarInsuranceHistoryParameter parameter)
        {
            var carInsuranceHistorys = await _carInsuranceHistoryService.GetAllCarHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInsuranceHistorys.PagingData));
            return Ok(carInsuranceHistorys);
        }

        /// <summary>
        /// Get Car Service History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Service History</returns>
        [HttpGet("{id}", Name = "GetCarInsuranceHistory")]
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(typeof(CarInsuranceHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarInsuranceHistoryAsync(int id)
        {
            var carInsuranceHistory = await _carInsuranceHistoryService.GetCarHistory(id);
            return Ok(carInsuranceHistory);
        }

        /// <summary>
        /// Get All Car Service Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Service History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}")]
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(typeof(IEnumerable<CarInsuranceHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInsuranceHistoryByCarIdAsync(string vinId, [FromQuery] CarInsuranceHistoryParameter parameter)
        {
            var carInsuranceHistorys = await _carInsuranceHistoryService.GetCarHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInsuranceHistorys.PagingData));
            return Ok(carInsuranceHistorys);
        }

        /// <summary>
        /// Get All Car Service Historys created by userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Service History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(typeof(IEnumerable<CarInsuranceHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarInsuranceHistoryByUserIdAsync(string userId, [FromQuery] CarInsuranceHistoryParameter parameter)
        {
            var carInsuranceHistorys = await _carInsuranceHistoryService.GetCarHistoryByUserId(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carInsuranceHistorys.PagingData));
            return Ok(carInsuranceHistorys);
        }

        /// <summary>
        /// Create Car Service History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car not found</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarInsuranceHistory")]
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarInsuranceHistoryAsync([FromBody] CarInsuranceHistoryCreateRequestDTO request)
        {
            CarInsuranceHistoryCreateRequestDTOValidator validator = new CarInsuranceHistoryCreateRequestDTOValidator();
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
            await _carInsuranceHistoryService.CreateCarHistory(request);
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
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarInsuranceHistoryCollectionAsync([FromBody] IEnumerable<CarInsuranceHistoryCreateRequestDTO> requests)
        {
            CarInsuranceHistoryCreateRequestDTOValidator validator = new CarInsuranceHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carInsuranceHistoryService.CreateCarHistoryCollection(requests);
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
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarInsuranceHistoryCollectionFromCsvAsync([FromForm] IFormFileCollection file)
        {
            if (file.Count != 1)
            {
                return BadRequest(new ErrorDetails("You should upload 1 file only"));
            }
            var requests = _csvServices.ConvertToListObject<CarInsuranceHistoryCreateRequestDTO>(file[0].OpenReadStream());
            //validate
            CarInsuranceHistoryCreateRequestDTOValidator validator = new CarInsuranceHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carInsuranceHistoryService.CreateCarHistoryCollection(requests);
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
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarInsuranceHistoryAsync(int id, [FromBody] CarInsuranceHistoryUpdateRequestDTO request)
        {
            CarInsuranceHistoryUpdateRequestDTOValidator validator = new CarInsuranceHistoryUpdateRequestDTOValidator();
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
            await _carInsuranceHistoryService.UpdateCarHistory(id, request);
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
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarHistoryAsync(int id)
        {
            await _carInsuranceHistoryService.DeleteCarHistory(id);
            return NoContent();
        }

        /// <summary>
        /// Get Car Historys Create Form Csv
        /// </summary>
        /// <returns>Car Historys List</returns>
        [HttpGet("collection/from-csv/form")]
        [Authorize(Roles = "Adminstrator,InsuranceCompany")]
        public async Task<IActionResult> GetCreateFormCarHistorysAsync()
        {
            var carHistorys = new List<CarInsuranceHistoryCreateRequestDTO>
            {
                new CarInsuranceHistoryCreateRequestDTO
                {
                    CarId = "Example",
                    Note = "None",
                    Odometer = null,
                    ReportDate = DateOnly.FromDateTime(DateTime.Now),
                    EndDate = DateOnly.FromDateTime(DateTime.Now),
                    Description = "None",
                    InsuranceNumber = "A12345",
                    StartDate = DateOnly.FromDateTime(DateTime.Now),
                }
            };
            Request.Headers.Accept = "text/csv";
            return Ok(carHistorys);
        }
    }
}
