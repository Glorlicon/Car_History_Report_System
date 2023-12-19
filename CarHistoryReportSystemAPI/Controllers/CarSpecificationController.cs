using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.DTO.ModelMaintainance;
using Application.Interfaces;
using AutoMapper;
using CarHistoryReportSystemAPI.Resources;
using Domain.Entities;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarSpecificationController : ControllerBase
    {
        private readonly ICarSpecificationService _carSpecService;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public CarSpecificationController(ICarSpecificationService carSpecService, IMapper mapper, IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _carSpecService = carSpecService;
            _mapper = mapper;
            _sharedLocalizer = sharedLocalizer;
        }

        /// <summary>
        /// Get All Car Models
        /// </summary>
        /// <returns>Car Model List</returns>
        [HttpGet(Name = "GetCarModels")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelsAsync([FromQuery] CarSpecificationParameter parameter)
        {
            var carModels = await _carSpecService.GetAllCarModels(parameter, trackChange: false);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
            return Ok(carModels);
        }

        /// <summary>
        /// Get All Car Models Test
        /// </summary>
        /// <returns>Car Model List</returns>
        [HttpGet("test",Name = "GetCarModelsTest")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelsTestAsync([FromQuery] CarSpecificationParameter parameter)
        {
            var carModels = await _carSpecService.GetAllCarModelsTest(parameter, trackChange: false);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
            return Ok(carModels);
        }

        /// <summary>
        /// Get Car Model By modelId
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns>Car Model</returns>
        [HttpGet("{modelId}", Name = "GetCarModel")]
        [ProducesResponseType(typeof(CarSpecificationResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
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
        [Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelByUserIdAsync(string userId, [FromQuery] CarSpecificationParameter parameter)
        {
            var carModels = await _carSpecService.GetCarModelByUserId(userId, parameter, trackChange: false);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
            return Ok(carModels);
        }

        /// <summary>
        /// Get All Car Models of manufacturerId
        /// </summary>
        /// <param name="manufacturerId"></param>
        /// <returns>Car Model List</returns>
        [HttpGet("manufacturer/{manufacturerId}", Name = "GetCarModelByManufacturerId")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelByManufacturerIdAsync(int manufacturerId, [FromQuery] CarSpecificationParameter parameter)
        {
            var carModels = await _carSpecService.GetCarModelByManufacturerId(manufacturerId, parameter, trackChange: false);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
            return Ok(carModels);
        }

        /// <summary>
        /// Get All Car Models that adminstrator create
        /// </summary>
        /// <returns>Car Model List</returns>
        [HttpGet("created-by-admin", Name = "GetCarModelsCreatedByAdminstrator")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(IEnumerable<CarSpecificationResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarModelsCreatedByAdminstrator([FromQuery] CarSpecificationParameter parameter)
        {
            var carModels = await _carSpecService.GetCarModelsCreatedByAdminstrator(parameter);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
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
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
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
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
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
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCarModelAsync(string modelId)
        {
            var result = await _carSpecService.DeleteCarModel(modelId);
            return NoContent();
        }

        /// <summary>
        /// Get All Model Maintainance
        /// </summary>
        /// <returns>Model Maintainance List</returns>
        [HttpGet("model-maintainances", Name = "GetModelMaintainances")]
        [ProducesResponseType(typeof(List<ModelMaintainanceResponseDTO>), StatusCodes.Status200OK)]
        [Authorize(Roles = "Adminstrator")]
        public async Task<IActionResult> GetModelMaintainances([FromQuery] ModelMaintainanceParameter parameter)
        {
            var carModels = await _carSpecService.GetModelMaintainances(parameter, trackChange: false);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
            return Ok(carModels);
        }

        /// <summary>
        /// Get All Model Maintainance of modelid
        /// </summary>
        /// <param name="modelId"></param>
        /// <returns>Model Maintainance List</returns>
        [HttpGet("model-maintainances/{modelId}", Name = "GetModelMaintainancesByModelId")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(List<ModelMaintainanceResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetModelMaintainancesByModelId(string modelId, [FromQuery] ModelMaintainanceParameter parameter)
        {
            var carModels = await _carSpecService.GetModelMaintainancesByModelId(modelId, parameter, trackChange: false);
            Response.Headers.AccessControlExposeHeaders = "*";
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carModels.PagingData));
            return Ok(carModels);
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
