using Application.DomainServices;
using Application.DTO.DataProvider;
using Application.DTO.Request;
using Application.Interfaces;
using Application.Validation.Request;
using Domain.Enum;
using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Application.Validation.DataProvider;
using Domain.Entities;
using Application.Common.Models;
using CarHistoryReportSystemAPI.Resources;
using Microsoft.Extensions.Localization;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataProviderController : ControllerBase
    {
        private readonly IDataProviderService _dataProviderService;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;

        public DataProviderController(IDataProviderService dataProviderService, IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _dataProviderService = dataProviderService;
            _sharedLocalizer = sharedLocalizer;
        }

        /// <summary>
        /// Get All Data Providers
        /// </summary>
        /// <returns>Data Provider List</returns>
        [HttpGet(Name = "GetDataProviders")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(IEnumerable<DataProviderDetailsResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDataProvidersAsync([FromQuery] DataProviderParameter parameter)
        {
            DataProviderParameterValidator validator = new DataProviderParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            var dataProviders = await _dataProviderService.GetAllDataProviders(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(dataProviders.PagingData));
            return Ok(dataProviders);
        }

        /// <summary>
        /// Get All Data Providers
        /// </summary>
        /// <returns>Data Provider List</returns>
        [HttpGet("type/{type}/no-user", Name = "GetDataProvidersWithoutUser")]
        [Authorize(Roles = "Adminstrator")]
        [ProducesResponseType(typeof(IEnumerable<DataProviderDetailsResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDataProvidersWithoutUserAsync(DataProviderParameter parameter, DataProviderType type)
        {
            var dataProviders = await _dataProviderService.GetAllDataProvidersWithoutUser(parameter, type);
            return Ok(dataProviders);
        }

        /// <summary>
        /// Get All Data Providers by type
        /// </summary>
        /// <returns>Data Provider List</returns>
        [HttpGet("type/{type}", Name = "GetDataProvidersByType")]
        [ProducesResponseType(typeof(IEnumerable<DataProviderDetailsResponseDTO>), StatusCodes.Status200OK)]
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
        [ProducesResponseType(typeof(DataProviderDetailsResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDataProviderAsync(int dataProviderId)
        {
            var dataProvider = await _dataProviderService.GetDataProvider(dataProviderId);
            return Ok(dataProvider);
        }

        /// <summary>
        /// Get All Data Provider Types
        /// </summary>
        /// <returns>Data Provider Type List</returns>
        [HttpGet("types-list", Name = "GetDataProviderTypes")]
        public IActionResult GetDataProviderTypes()
        {
            var listTypes = Enum.GetNames(typeof(DataProviderType));
            return Ok(listTypes);
        }

        /// <summary>
        /// Get Data Provider Of user with id UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Data Provider</returns>
        [HttpGet("user/{userId}", Name = nameof(GetDataProviderByUserIdAsync))]
        [ProducesResponseType(typeof(DataProviderDetailsResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
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
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateDataProviderAsync([FromBody] DataProviderCreateRequestDTO request)
        {
            DataProviderCreateRequestDTOValidator validator = new DataProviderCreateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            var dataProvider = await _dataProviderService.CreateDataProvider(request);
            // Change Later
            return Ok(dataProvider);
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
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateDataProviderAsync(int dataProviderId, [FromBody] DataProviderUpdateRequestDTO request)
        {
            DataProviderUpdateRequestDTOValidator validator = new DataProviderUpdateRequestDTOValidator();
            var validationResult = validator.Validate(request);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            var dataProvider = await _dataProviderService.UpdateDataProvider(dataProviderId, request);
            return Ok(dataProvider);
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
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteDataProviderAsync(int dataProviderId)
        {
            var result = await _dataProviderService.DeleteDataProvider(dataProviderId);
            return NoContent();

        }

        /// <summary>
        /// Contact Data Provider
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="201">Contacted Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Contact Failed</response>
        [HttpPost("contact")]
        //remove authorize
        //[Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ContactCreateDataProviderAsync([FromBody] DataProviderContactCreateRequestDTO request)
        {
            //DataProviderCreateRequestDTOValidator validator = new DataProviderCreateRequestDTOValidator();
            //var result = validator.Validate(request);
            //if (!result.IsValid)
            //{
            //    result.AddToModelState(ModelState);
            //    return BadRequest(ModelState);
            //}
            var result = await _dataProviderService.ContactDataProvider(request);
            // Change Later
            return Ok(result);
        }

        /// <summary>
        /// Get All Review
        /// </summary>
        /// <returns>Review List</returns>
        [HttpGet("reviews", Name = "GetAllReview")]
        //[Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllReview([FromQuery] DataProviderReviewParameter parameter)
        {
            DataProviderReviewParameterValidator validator = new DataProviderReviewParameterValidator();
            var validationResult = validator.Validate(parameter);
            if (!validationResult.IsValid)
            {
                var errors = new ErrorDetails();
                foreach (var error in validationResult.Errors)
                {
                    errors.Error.Add(_sharedLocalizer[error.ErrorMessage]);
                }
                return BadRequest(errors);
            }
            var reviews = await _dataProviderService.GetAllReview(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(reviews.PagingData));
            return Ok(reviews);
        }

        /// <summary>
        /// Get Review By DataProviderId and UserId
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <param name="userId"></param>
        /// <returns>Review</returns>
        [HttpGet("{dataProviderId}/review/{userId}", Name = "GetReview")]
        [Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReview(string userId, int dataProviderId)
        {
            var dataProvider = await _dataProviderService.GetReview(userId, dataProviderId);
            return Ok(dataProvider);
        }

        /// <summary>
        /// Create Review Data Provider
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns></returns>
        /// <response code="201">Reviewed Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Review Failed</response>
        [HttpPost("{dataProviderId}/review", Name = "ReviewDataProvider")]
        [Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ReviewDataProvider(int dataProviderId, [FromBody] DataProviderReviewCreateRequestDTO request)
        {
            //DataProviderCreateRequestDTOValidator validator = new DataProviderCreateRequestDTOValidator();
            //var validationResult = validator.Validate(request);
            //if (!validationResult.IsValid)
            //{
            //    var errors = new ErrorDetails();
            //    foreach (var error in validationResult.Errors)
            //    {
            //        errors.Error.Add(error.ErrorMessage);
            //    }
            //    return BadRequest(errors);
            //}
            var review = await _dataProviderService.ReviewDataProvider(dataProviderId, request);
            return Ok(review);
        }        
        
        /// <summary>
        /// Edit Review Data Provider
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <returns></returns>
        /// <response code="201">Edit Review Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Edit Review Failed</response>
        [HttpPut("{dataProviderId}/review", Name = "ReviewDataProvider")]
        [Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditReviewDataProvider(int dataProviderId, [FromBody] DataProviderReviewUpdateRequestDTO request)
        {
            //DataProviderCreateRequestDTOValidator validator = new DataProviderCreateRequestDTOValidator();
            //var validationResult = validator.Validate(request);
            //if (!validationResult.IsValid)
            //{
            //    var errors = new ErrorDetails();
            //    foreach (var error in validationResult.Errors)
            //    {
            //        errors.Error.Add(error.ErrorMessage);
            //    }
            //    return BadRequest(errors);
            //}
            var review = await _dataProviderService.EditReviewDataProvider(dataProviderId, request);
            return Ok(review);
        }

        /// <summary>
        /// Delete Review Data Provider
        /// </summary>
        /// <param name="dataProviderId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// <response code="204">Deleted Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Review Data Provider Not Found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{dataProviderId}/review/{userId}")]
        [Authorize(Roles = "Adminstrator,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice,User")]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteReviewDataProviderAsync(int dataProviderId, string userId)
        {
            var result = await _dataProviderService.DeleteReviewDataProvider(dataProviderId, userId);
            return NoContent();

        }
    }
}
