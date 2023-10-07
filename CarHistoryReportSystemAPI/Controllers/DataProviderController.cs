using Application.DTO.DataProvider;
using Application.Interfaces;
using Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataProviderController : ControllerBase
    {
        private readonly IDataProviderService _dataProviderService;

        public DataProviderController(IDataProviderService dataProviderService)
        {
            _dataProviderService = dataProviderService;
        }

        /// <summary>
        /// Get All Data Providers
        /// </summary>
        /// <returns>Data Provider List</returns>
        [HttpGet(Name = "GetDataProviders")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(IEnumerable<DataProviderResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDataProvidersAsync()
        {
            var dataProviders = await _dataProviderService.GetAllDataProviders();
            return Ok(dataProviders);
        }

        /// <summary>
        /// Get All Data Providers
        /// </summary>
        /// <returns>Data Provider List</returns>
        [HttpGet("type/{type}/no-user",Name = "GetDataProvidersWithoutUser")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(IEnumerable<DataProviderResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDataProvidersWithoutUserAsync(DataProviderType type)
        {
            var dataProviders = await _dataProviderService.GetAllDataProvidersWithoutUser(type);
            return Ok(dataProviders);
        }

        /// <summary>
        /// Get All Data Providers by type
        /// </summary>
        /// <returns>Data Provider List</returns>
        [HttpGet("type/{type}",Name = "GetDataProvidersByType")]
        [ProducesResponseType(typeof(IEnumerable<DataProviderResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDataProvidersByTypeAsync(DataProviderType type)
        {
            var dataProviders = await _dataProviderService.GetAllDataProvidersByType(type);
            return Ok(dataProviders);
        }

        /// <summary>
        /// Get Data Provider By dataProviderId
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns>Data Provider</returns>
        [HttpGet("{dataProviderId}", Name = "GetDataProvider")]
        [ProducesResponseType(typeof(DataProviderResponseDTO),StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDataProviderAsync(int dataProviderId)
        {
            var dataProvider = await _dataProviderService.GetDataProvider(dataProviderId);
            return Ok(dataProvider);
        }

        /// <summary>
        /// Get All Data Provider Types
        /// </summary>
        /// <returns>Data Provider Type List</returns>
        [HttpGet("types-list",Name = "GetDataProviderTypes")]
        public IActionResult GetDataProviderTypes()
        {
            var listTypes = Enum.GetNames(typeof(DataProviderType));
            return Ok(listTypes);
        }

        /// <summary>
        /// Get All Data Provider Of user with id UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Data Provider</returns>
        [HttpGet("user/{userId}", Name = nameof(GetDataProviderByUserIdAsync))]
        [ProducesResponseType(typeof(DataProviderResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDataProviderByUserIdAsync(string userId)
        {
            var dataProvider = await _dataProviderService.GetDataProviderByUserId(userId);
            return Ok(dataProvider);
        }

        /// <summary>
        /// Create Data Provider
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="201">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateDataProvider")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateDataProviderAsync([FromBody] DataProviderCreateRequestDTO request)
        {
            var dataProviderId = await _dataProviderService.CreateDataProvider(request);
            // Change Later
            return CreatedAtRoute("GetDataProvider", new { dataProviderId = dataProviderId }, null);
        }

        /// <summary>
        /// Update Data Provider
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Data Provider Not Found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{dataProviderId}")]
        [Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateDataProviderAsync(int dataProviderId, [FromBody] DataProviderUpdateRequestDTO request)
        {
            var result = await _dataProviderService.UpdateDataProvider(dataProviderId, request);
            return NoContent();
        }

        /// <summary>
        /// Delete Data Provider
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Data Provider Not Found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{dataProviderId}")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteDataProviderAsync(int dataProviderId)
        {
            var result = await _dataProviderService.DeleteDataProvider(dataProviderId);
            return NoContent();

        }
    }
}
