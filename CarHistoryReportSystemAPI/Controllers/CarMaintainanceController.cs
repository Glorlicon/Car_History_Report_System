using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.Car;
using Application.DTO.CarMaintainance;
using Application.Interfaces;
using Application.Validation.Car;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarMaintainanceController : ControllerBase
    {
        private readonly ICarMaintainanceServices _carMaintainanceServices;

        public CarMaintainanceController(ICarMaintainanceServices carMaintainanceServices)
        {
            _carMaintainanceServices = carMaintainanceServices;
        }

        /// <summary>
        /// Get All Cars Maintanance Tracking List by UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Car Maintainace Tracking List List</returns>
        [HttpGet("user/{userId}", Name = nameof(GetCarMaintainanceTrackingListByUserIdAsync))]
        [ProducesResponseType(typeof(IEnumerable<CarMaintainanceTrackingResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCarMaintainanceTrackingListByUserIdAsync(string userId)
        {
            var carsTrackingList = await _carMaintainanceServices.GetCarMaintainanceTrackingListByUserId(userId); 
            return Ok(carsTrackingList);
        }

        /// <summary>
        /// Add Car To Maintainance TrackingList
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Add Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost("car-maintainance")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddCarToTrackingList([FromBody] AddCarToTrackingListRequestDTO request)
        {
            await _carMaintainanceServices.AddCarToTrackingList(request);
            return NoContent();
        }

        /// <summary>
        /// Remove Car From tracking list
        /// </summary>
        /// <param name="vinId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Car not found in tracking list</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("car-maintainance/car/{vinId}/user/{userId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveCarFromTrackingListAsync(string vinId, string userId)
        {
            await _carMaintainanceServices.RemoveCarFromTrackingList(vinId, userId);
            return NoContent();
        }
    }
}
