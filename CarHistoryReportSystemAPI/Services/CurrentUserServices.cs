using Application.Interfaces;
using Domain.Entities;
using System.Security.Claims;

namespace CarHistoryReportSystemAPI.Services
{
    public class CurrentUserServices : ICurrentUserServices
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CurrentUserServices(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
