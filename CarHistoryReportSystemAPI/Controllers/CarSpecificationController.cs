using Application.DTO.CarSpecification;
using Application.Interfaces;
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
        /// <returns></returns>
        [HttpGet(Name = "GetCarModels")]
        public async Task<IActionResult> GetCarModelsAsync()
        {
            var carModels = await _carSpecService.GetAllCarModels(trackChange: false);
            return Ok(carModels);
        }

        /// <summary>
        /// Get Car Model By modelId
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns></returns>
        [HttpGet("{modelId}", Name = "GetCarModel")]
        public async Task<IActionResult> GetCarModelAsync(string modelId)
        {
            var carModel = await _carSpecService.GetCarModel(modelId, trackChange: false);
            return Ok(carModel);
        }

        /// <summary>
        /// Get All Car Models Created by UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("user/{userId}", Name = nameof(GetCarModelByUserIdAsync))]
        public async Task<IActionResult> GetCarModelByUserIdAsync(string userId)
        {
            var carModels = await _carSpecService.GetCarModelByUserId(userId, trackChange: false);
            return Ok(carModels);
        }

        /// <summary>
        /// Get All Car Models of manufacturerId
        /// </summary>
        /// <param name="manufacturerId"></param>
        /// <returns></returns>
        [HttpGet("manufacturer/{manufacturerId}", Name = "GetCarModelByManufacturerId")]
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
        /// <response code="400">Created failed</response>
        [HttpPost(Name = "CreateCarModel")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCarModelAsync([FromBody] CarSpecificationCreateRequestDTO request)
        {
            var result = await _carSpecService.CreateCarModel(request);
            if (result == true)
            {
                return CreatedAtRoute("GetCarModel", new { modelId = request.ModelID }, null);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Update Car Model
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Updated failed</response>
        [HttpPut("{modelId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateCarModelAsync(string modelId, [FromBody] CarSpecificationUpdateRequestDTO request)
        {
            var result = await _carSpecService.UpdateCarModel(modelId, request);
            if (result == true)
            {
                return NoContent();
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Delete Car Model
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Updated failed</response>
        [HttpDelete("{modelId}")]
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteCarModelAsync(string modelId)
        {
            var result = await _carSpecService.DeleteCarModel(modelId);
            if (result == true)
            {
                return NoContent();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
