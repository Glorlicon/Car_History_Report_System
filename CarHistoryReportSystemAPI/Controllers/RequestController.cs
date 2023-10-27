using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.CarSpecification;
using Application.DTO.Request;
using Application.Interfaces;
using Application.Validation.Car;
using Application.Validation.CarOwnerHistory;
using Application.Validation.Request;
using Domain.Enum;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly IRequestServices _requestService;
        public RequestController(IRequestServices requestService)
        {
            _requestService = requestService;
        }

        /// <summary>
        /// Get Requests
        /// </summary>
        /// <returns>Request list</returns>
        [HttpGet(Name = "GetRequests")]
        [ProducesResponseType(typeof(IEnumerable<RequestResponseRequestDTO>), StatusCodes.Status200OK)]
        [Authorize(Roles = "Adminstrator")]
        public async Task<IActionResult> GetRequestsAsync([FromQuery] RequestParameter parameter)
        {
            RequestParameterValidator validator = new RequestParameterValidator();
            var result = validator.Validate(parameter);
            if (!result.IsValid)
            {
                result.AddToModelState(ModelState);
                return BadRequest(ModelState);
            }
            var requests = await _requestService.GetAllRequests(parameter, trackChange: false);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(requests.PagingData));
            return Ok(requests);
        }

        /// <summary>
        /// Get Request by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Car Model</returns>
        [HttpGet("{id}", Name = "GetRequest")]
        [ProducesResponseType(typeof(RequestResponseRequestDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(RequestResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails),StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Adminstrator")]
        public async Task<IActionResult> GetRequestAsync(int id)
        {
            var request = await _requestService.GetRequest(id, trackChange: false);
            return Ok(request);
        }

        /// <summary>
        /// Get All Requests Created by UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Request List</returns>
        [HttpGet("user/{userId}", Name = nameof(GetAllRequestByUserIdAsync))]
        [Authorize(Roles = "Adminstrator,User,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice")]
        [ProducesResponseType(typeof(IEnumerable<RequestResponseRequestDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllRequestByUserIdAsync(string userId, [FromQuery] RequestParameter parameter)
        {
            RequestParameterValidator validator = new RequestParameterValidator();
            var result = validator.Validate(parameter);
            if (!result.IsValid)
            {
                result.AddToModelState(ModelState);
                return BadRequest(ModelState);
            }
            var requests = await _requestService.GetAllRequestByUserId(userId, parameter, trackChange: false);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(requests.PagingData));
            return Ok(requests);
        }

        /// <summary>
        /// Create request
        /// </summary>
        /// <param name="requestDTO"></param>
        /// <returns></returns>
        /// <response code="201">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost(Name = "CreateRequest")]
        [Authorize(Roles = "Adminstrator,User,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateRequestAsync([FromBody] RequestCreateRequestDTO requestDTO)
        {
            var result = await _requestService.CreateRequest(requestDTO);
            if (result == true)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }



        /// <summary>
        /// Update Request
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Request not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPut("{id}")]
        [Authorize(Roles = "Adminstrator,User,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateRequestAsync(int id, [FromBody] RequestUpdateRequestDTO requestDTO)
        {
            var result = await _requestService.UpdateRequest(id, requestDTO);
            if (result == true)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Delete Request
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Updated Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Request not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Adminstrator,User,CarDealer,InsuranceCompany,ServiceShop,Manufacturer,VehicleRegistry,PoliceOffice")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteRequestAsync(int id)
        {
            var result = await _requestService.DeleteRequest(id);
            if (result == true)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Get All Request Status
        /// </summary>
        /// <returns>Request status list</returns>
        [HttpGet("request-statuses-list", Name = "GetRequestStatuses")]
        public IActionResult GetRequestStatuses()
        {
            var listStatus = Enum.GetNames(typeof(UserRequestStatus));
            return Ok(listStatus);
        }

        /// <summary>
        /// Get All Request Type
        /// </summary>
        /// <returns>Request Type List</returns>
        [HttpGet("request-types-list", Name = "GetRequestTypes")]
        public IActionResult GetBodyTypes()
        {
            var listTypes = Enum.GetNames(typeof(UserRequestType));
            return Ok(listTypes);
        }

    }
}
