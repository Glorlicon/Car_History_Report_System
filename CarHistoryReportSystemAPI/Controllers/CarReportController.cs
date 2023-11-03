using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarReport;
using Application.Interfaces;
using Application.Validation.Car;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarReportController : ControllerBase
    {
        private readonly ICarReportServices _carReportService;

        public CarReportController(ICarReportServices carReportService)
        {
            _carReportService = carReportService;
        }

        /// <summary>
        /// Get All Car Reports
        /// </summary>
        /// <returns>Car Report List</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CarReportResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCarReportListAsync()
        {
            var carReports = await _carReportService.GetAllCarReports();
            return Ok(carReports);
        }

        /// <summary>
        /// Get All Car Reports By UserId
        /// </summary>
        /// <param name="userId">UserId </param>
        /// <returns>Car Report List</returns>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<CarReportResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCarReportsByUserIdAsync(string userId)
        {
            var carReports = await _carReportService.GetCarReportsByUserId(userId);
            return Ok(carReports);
        }

        /// <summary>
        /// Get Car Report Data
        /// </summary>
        /// <param name="carId">car vin id</param>
        /// <returns>Car Report Data</returns>
        /// <response code="200">Get Successfully</response>
        /// <response code="400">User dont buy enough car report</response>
        /// <response code="401">User is not authorized to access car report</response>
        /// <response code="404">User not found, car not found, car report not found</response>
        [HttpGet("{carId}")]
        [ProducesResponseType(typeof(CarReportDataResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarReportAsync(string carId)
        {
            var carReport = await _carReportService.GetCarReportDataByCarId(carId);
            return Ok(carReport);
        }

        /// <summary>
        /// Add Car Report to user car report list
        /// </summary>
        /// <returns>Car Report</returns>
        /// <response code="204">Add Successfully</response>
        /// <response code="400">User dont buy enough car report</response>
        /// <response code="404">User not found, car not found</response>
        /// <response code="500">Add failed</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddCarReportToUserCarReportList([FromBody] CarReportCreateRequestDTO request)
        {
            await _carReportService.AddCarReportToUserCarReportList(request);
            return NoContent();
        }

        /// <summary>
        /// Check if car report exist for user
        /// </summary>
        /// <param name="carId">car vin id</param>
        /// <param name="userId">userId</param>
        /// <returns>car report record</returns>
        /// <response code="404">Car report not found</response>
        [HttpGet("{carId}/{userId}")]
        [ProducesResponseType(typeof(CarReportResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarReportsByIdAsync(string carId, string userId)
        {
            var isExist = await _carReportService.GetCarReportById(carId, userId);
            return Ok(isExist);
        }
    }
}
