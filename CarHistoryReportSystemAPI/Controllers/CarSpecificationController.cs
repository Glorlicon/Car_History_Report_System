using Application.DTO.CarSpecification;
using Application.Interfaces;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarSpecificationController : ControllerBase
    {
        private readonly ICarSpecificationService _carSpecService;

        public CarSpecificationController(ICarSpecificationService carSpecService)
        {
            _carSpecService = carSpecService;
        }

        /// <summary>
        /// Get All Car Models
        /// </summary>
        /// <returns>Car Model List</returns>
        [HttpGet(Name = "GetCarModels")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelsAsync()
        {
            var carModels = await _carSpecService.GetAllCarModels(trackChange: false);
            return Ok(carModels);
        }

        /// <summary>
        /// Get Car Model By modelId
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns>Car Model</returns>
        [HttpGet("{modelId}", Name = "GetCarModel")]
        [ProducesResponseType(typeof(CarSpecificationResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCarModelAsync(string modelId)
        {
            var carModel = await _carSpecService.GetCarModel(modelId, trackChange: false);
            return Ok(carModel);
        }

        /// <summary>
        /// Get All Car Models Created by UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Model List</returns>
        [HttpGet("user/{userId}", Name = nameof(GetCarModelByUserIdAsync))]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelByUserIdAsync(string userId)
        {
            var carModels = await _carSpecService.GetCarModelByUserId(userId, trackChange: false);
            return Ok(carModels);
        }

        /// <summary>
        /// Get All Car Models of manufacturerId
        /// </summary>
        /// <param name="manufacturerId"></param>
        /// <returns>Car Model List</returns>
        [HttpGet("manufacturer/{manufacturerId}", Name = "GetCarModelByManufacturerId")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelByManufacturerIdAsync(int manufacturerId)
        {
            var carModels = await _carSpecService.GetCarModelByManufacturerId(manufacturerId, trackChange: false);
            return Ok(carModels);
        }

        /// <summary>
        /// Create car model
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="201">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateCarModel")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCarModelAsync([FromBody] CarSpecificationCreateRequestDTO request)
        {
            var result = await _carSpecService.CreateCarModel(request);
            return CreatedAtRoute("GetCarModel", new { modelId = request.ModelID },null);
        }

        /// <summary>
        /// Update Car Model
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car model not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{modelId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCarModelAsync(string modelId, [FromBody] CarSpecificationUpdateRequestDTO request)
        {
            var result = await _carSpecService.UpdateCarModel(modelId, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Car Model
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car model not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{modelId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarModelAsync(string modelId)
        {
            var result = await _carSpecService.DeleteCarModel(modelId);
            return NoContent();
        }

        /// <summary>
        /// Get All Fuel Types
        /// </summary>
        /// <returns>Fuel Type List</returns>
        [HttpGet("fuel-types-list",Name = "GetFuelTypes")]
        public IActionResult GetFuelTypes()
        {
            var listTypes = Enum.GetNames(typeof(FuelType));
            return Ok(listTypes);
        }

        /// <summary>
        /// Get All Body Types
        /// </summary>
        /// <returns>Body Type List</returns>
        [HttpGet("body-types-list", Name = "GetBodyTypes")]
        public IActionResult GetBodyTypes()
        {
            var listTypes = Enum.GetNames(typeof(BodyType));
            return Ok(listTypes);
        }
    }
}
