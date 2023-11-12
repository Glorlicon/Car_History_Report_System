using Application.Common.Models;
using Application.DomainServices;
using Application.DTO.CarTracking;
using Application.DTO.Notification;
using Application.DTO.Order;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationServices _notificationService;

        public NotificationsController(INotificationServices notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Get All Notifications
        /// For Test purpose only
        /// </summary>
        /// <returns>User Notification List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<NotificationResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetNotificationsAsync([FromQuery] NotificationParameter parameter)
        {
            var notifications = await _notificationService.GetAllNotifications(parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(notifications.PagingData));
            return Ok(notifications);
        }

        /// <summary>
        /// Get Notification By id
        /// For Test purpose only
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Notification</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(NotificationResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetNotificationAsync(int id)
        {
            var notification = await _notificationService.GetNotification(id);
            return Ok(notification);
        }

        /// <summary>
        /// Create order
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <response code="204">Created Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="500">Create Failed</response>
        [HttpPost]
        //[Authorize(Roles = "Adminstrator,Manufacturer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateNotificationAsync([FromBody] NotificationCreateRequestDTO request)
        {
            await _notificationService.CreateNotification(request);
            return NoContent();
        }

        /// <summary>
        /// Delete Notification
        /// For Test purpose only
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <response code="204">Delete Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Notification not found</response>
        /// <response code="500">Delete Failed</response>
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Adminstrator,CarDealer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteNotificationAsync(int id)
        {
            await _notificationService.DeleteNotification(id);
            return NoContent();
        }

        /// <summary>
        /// Get User Notifications
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>User Notification List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<UserNotificationResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUserNotificationsAsync(string userId, [FromQuery] UserNotificationParameter parameter)
        {
            var notifications = await _notificationService.GetUserNotifications(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(notifications.PagingData));
            return Ok(notifications);
        }

        /// <summary>
        /// Mark User Notifications as Read
        /// </summary>
        /// <param name="notificationId"></param>
        /// <param name="userId"></param>
        /// <returns>No Content</returns>
        /// <response code="204">Update Successfully</response>
        /// <response code="400">Invalid Request</response>
        /// <response code="404">Notification or userId not found</response>
        /// <response code="500">Update Failed</response>
        [HttpPost("{notificationId}/{userId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ReadUserNotificationsAsync(int notificationId, string userId)
        {
            await _notificationService.ReadUserNotification(userId, notificationId);
            return NoContent();
        }

        /// <summary>
        /// Get All Police's car tracking
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="parameter"></param>
        /// <returns>Car Tracking List</returns>
        /// <response code="400">Invalid Request</response>
        [HttpGet("car-tracking/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<CarTrackingResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCarTrackingsAsync(string userId, [FromQuery] CarTrackingParameter parameter)
        {
            var carTrackings = await _notificationService.GetCarTrackedList(userId, parameter);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(carTrackings.PagingData));
            return Ok(carTrackings);
        }

        /// <summary>
        /// Police Track a car to receive notification
        /// </summary>
        /// <response code="204">Track car successfully</response>
        /// <response code="400">Car already tracked</response>
        /// <response code="500">Database operation failed</response>
        [HttpPost("car-tracking")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> TrackingCarAsync([FromBody] CarTrackingCreateRequestDTO request)
        {
            await _notificationService.TrackCar(request.UserId, request.CarId);
            return NoContent();
        }

        /// <summary>
        /// Police stop Track a car, stop receive notification
        /// </summary>
        /// <response code="204">Stop Track car successfully</response>
        /// <response code="400">Invalid request</response>
        /// <response code="404">Car Tracking Not Found</response>
        /// <response code="500">Database operation failed</response>
        [HttpPost("car-tracking/untrack")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> StopTrackingCarAsync([FromBody] CarTrackingUpdateRequestDTO request)
        {
            await _notificationService.StopTrackingCar(request.UserId, request.CarId);
            return NoContent();
        }
    }
}
