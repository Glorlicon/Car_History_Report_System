using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.CarAccidentHistory;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarStolenHistory;
using Application.Interfaces;
using Application.Validation;
using Application.Validation.CarAccidentHistory;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarAccidentHistoryController : ControllerBase
    {
        private readonly ICarHistoryServices<CarAccidentHistoryResponseDTO,
                                             CarAccidentHistoryParameter,
                                             CarAccidentHistoryCreateRequestDTO,
                                             CarAccidentHistoryUpdateRequestDTO> _carAccidentHistoryService;
        private readonly ICsvServices _csvServices;

        public CarAccidentHistoryController(ICarHistoryServices<CarAccidentHistoryResponseDTO,
                                                             CarAccidentHistoryParameter,
                                                             CarAccidentHistoryCreateRequestDTO,
                                                             CarAccidentHistoryUpdateRequestDTO> carAccidentHistoryService
                                        , ICsvServices csvServices)
        {
            _carAccidentHistoryService = carAccidentHistoryService;
            _csvServices = csvServices;
        }

        /// <summary>
        /// Get All Car Accident Historys
        /// </summary>
        /// <returns>Car Historys List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<CarAccidentHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarAccidentHistorysAsync([FromQuery] CarAccidentHistoryParameter parameter)
        {
            var carAccidentHistorys = await _carAccidentHistoryService.GetAllCarHistorys(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carAccidentHistorys.PagingData));
            return Ok(carAccidentHistorys);
        }

        /// <summary>
        /// Get Car Accident History By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Accident History</returns>
        [HttpGet("{id}", Name = "GetCarAccidentHistory")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(CarAccidentHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarAccidentHistoryAsync(int id)
        {
            var carAccidentHistory = await _carAccidentHistoryService.GetCarHistory(id);
            return Ok(carAccidentHistory);
        }

        /// <summary>
        /// Get All Car Accident Historys of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car Accident History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<CarAccidentHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarAccidentHistoryByCarIdAsync(string vinId, [FromQuery] CarAccidentHistoryParameter parameter)
        {
            var carAccidentHistorys = await _carAccidentHistoryService.GetCarHistoryByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carAccidentHistorys.PagingData));
            return Ok(carAccidentHistorys);
        }

        /// <summary>
        /// Get All Car Accident Historys created by userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Accident History List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<CarAccidentHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarAccidentHistoryByUserIdAsync(string userId, [FromQuery] CarAccidentHistoryParameter parameter)
        {
            var carAccidentHistorys = await _carAccidentHistoryService.GetCarHistoryByUserId(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carAccidentHistorys.PagingData));
            return Ok(carAccidentHistorys);
        }

        /// <summary>
        /// Create Car Accident History
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car not found</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarAccidentHistory")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarAccidentHistoryAsync([FromBody] CarAccidentHistoryCreateRequestDTO request)
        {
            CarAccidentHistoryCreateRequestDTOValidator validator = new CarAccidentHistoryCreateRequestDTOValidator();
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
            await _carAccidentHistoryService.CreateCarHistory(request);
            return NoContent();
        }

        /// <summary>
        /// Create Car Accident History collection
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
        public async Task<IActionResult> CreateCarAccidentHistoryCollectionAsync([FromBody] IEnumerable<CarAccidentHistoryCreateRequestDTO> requests)
        {
            CarAccidentHistoryCreateRequestDTOValidator validator = new CarAccidentHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carAccidentHistoryService.CreateCarHistoryCollection(requests);
            return NoContent();
        }

        /// <summary>
        /// Create Car Accident History from csv file
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
        public async Task<IActionResult> CreateCarAccidentHistoryCollectionFromCsvAsync([FromForm] IFormFileCollection file)
        {
            if (file.Count != 1)
            {
                return BadRequest(new ErrorDetails("You should upload 1 file only"));
            }
            var requests = _csvServices.ConvertToListObject<CarAccidentHistoryCreateRequestDTO>(file[0].OpenReadStream());
            //validate
            CarAccidentHistoryCreateRequestDTOValidator validator = new CarAccidentHistoryCreateRequestDTOValidator();
            var errors = validator.ValidateList(requests);
            if (errors.Error.Count > 0) return BadRequest(errors);
            await _carAccidentHistoryService.CreateCarHistoryCollection(requests);
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
        public async Task<IActionResult> UpdateCarAccidentHistoryAsync(int id, [FromBody] CarAccidentHistoryUpdateRequestDTO request)
        {
            CarAccidentHistoryUpdateRequestDTOValidator validator = new CarAccidentHistoryUpdateRequestDTOValidator();
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
            await _carAccidentHistoryService.UpdateCarHistory(id, request);
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
            await _carAccidentHistoryService.DeleteCarHistory(id);
            return NoContent();
        }

        /// <summary>
        /// Get All Car Accident Historys of Insurance Own Company
        /// </summary>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("insurance-own", Name = "GetCarAccidentHistorysByOwnInsuranceCompany")]
        [Authorize(Roles = "InsuranceCompany")]
        [ProducesResponseType(typeof(IEnumerable<CarAccidentHistoryResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarAccidentHistorysByOwnInsuranceCompany([FromQuery] CarAccidentHistoryParameter parameter)
        {
            var carAccidentHistorys = await _carAccidentHistoryService.InsuranceCompanyGetOwnCarHistories(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carAccidentHistorys.PagingData));
            return Ok(carAccidentHistorys);
        }

        /// <summary>
        /// Get Car Accident History detail by own insurance company
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Accident History Detail</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("insurance-own/{id}")]
        [Authorize(Roles = "InsuranceCompany")]
        [ProducesResponseType(typeof(CarAccidentHistoryResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarAccidentHistoryByIdAsync(int id)
        {
            var carAccidentHistory = await _carAccidentHistoryService.InsuranceCompanyGetOwnCarHistoryDetail(id);
            return Ok(carAccidentHistory);
        }

        /// <summary>
        /// Get Car Historys Create Form Csv
        /// </summary>
        /// <returns>Car Historys List</returns>
        [HttpGet("collection/from-csv/form")]
        [Authorize(Roles = "Adminstrator,PoliceOffice")]
        public async Task<IActionResult> GetCreateFormCarHistorysAsync()
        {
            var carHistorys = new List<CarAccidentHistoryCreateRequestDTO>
            {
                new CarAccidentHistoryCreateRequestDTO
                {
                    CarId = "Example",
                    Note = "None",
                    Odometer = null,
                    ReportDate = DateOnly.FromDateTime(DateTime.Now),
                    AccidentDate = DateOnly.FromDateTime(DateTime.Now),
                    DamageLocation = AccidentDamageLocation.Front | AccidentDamageLocation.Rear | AccidentDamageLocation.Left | AccidentDamageLocation.Right,
                    Description = "None",
                    Location = null,
                    Serverity = 0.5f
                }
            };
            Request.Headers.Accept = "text/csv";
            return Ok(carHistorys);
        }
    }
}
