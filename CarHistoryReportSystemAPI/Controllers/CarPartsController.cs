using Application.DTO.Car;
using Application.DTO.CarPart;
using Application.Interfaces;
using Application.Validation.Car;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarPartsController : ControllerBase
    {
        private readonly ICarPartServices _carPartService;

        public CarPartsController(ICarPartServices carPartService)
        {
            _carPartService = carPartService;
        }

        /// <summary>
        /// Get All Car Parts
        /// </summary>
        /// <returns>Car Parts List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet(Name = "GetCarParts")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarPartsAsync([FromQuery] CarPartParameter parameter)
        {
            var carParts = await _carPartService.GetAllCarParts(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carParts.PagingData));
            return Ok(carParts);
        }

        /// <summary>
        /// Get Car Part By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Part</returns>
        [HttpGet("{id}", Name = "GetCarPart")]
        [ProducesResponseType(typeof(CarResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarPartAsync(int id)
        {
            var carPart = await _carPartService.GetCarPart(id);
            return Ok(carPart);
        }

        /// <summary>
        /// Get All Car Parts of manufacturerId
        /// </summary>
        /// <param name="manufacturerId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("manufacturer/{manufacturerId}", Name = "GetCarPartByManufacturerId")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarPartByManufacturerIdAsync(int manufacturerId, [FromQuery] CarPartParameter parameter)
        {
            var carParts = await _carPartService.GetCarPartByManufacturerId(manufacturerId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carParts.PagingData));
            return Ok(carParts);
        }

        /// <summary>
        /// Get All Car Parts of Car Id
        /// </summary>
        /// <param name="vinId"></param>
        /// <returns>Car List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car/{vinId}", Name = "GetCarPartByCarId")]
        [ProducesResponseType(typeof(IEnumerable<CarResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarPartByManufacturerIdAsync(string vinId, [FromQuery] CarPartParameter parameter)
        {
            var carParts = await _carPartService.GetCarPartByCarId(vinId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carParts.PagingData));
            return Ok(carParts);
        }

        /// <summary>
        /// Create Car Part
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarPart")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarPartAsync([FromBody] CarPartCreateRequestDTO request)
        {
            var result = await _carPartService.CreateCarPart(request);
            return NoContent();
        }

        /// <summary>
        /// Update Car Part
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car Part not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarPartAsync(int id, [FromBody] CarPartUpdateRequestDTO request)
        {
            var result = await _carPartService.UpdateCarPart(id, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car Part
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car Part not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarAsync(int id)
        {
            var result = await _carPartService.DeleteCarPart(id);
            return NoContent();
        }
    }
}
