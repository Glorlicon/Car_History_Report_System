using Application.Common.Models;
using Application.DTO.Notification;
using Application.DTO.Request;
using Application.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;

namespace Application.DomainServices
{
    public class RequestServices : IRequestServices
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IMapper _mapper;
        private readonly INotificationServices _notificationServices;
        private readonly IAuthenticationServices _authenticationServices;
        public RequestServices(IRequestRepository requestRepository, IMapper mapper, IAuthenticationServices authenticationServices, INotificationServices notificationServices)
        {
            _requestRepository = requestRepository;
            _mapper = mapper;
            _authenticationServices = authenticationServices;
            _notificationServices = notificationServices;
        }

        public async Task<PagedList<RequestResponseDTO>> GetAllRequests(RequestParameter parameter, bool trackChange)
        {
            IEnumerable<Request> requests = null;
            var user = await _authenticationServices.GetCurrentUserAsync();
            if (user.Role == Role.Adminstrator)
            {
                requests = await _requestRepository.GetAllRequests(parameter, trackChange);
            }
            else if (Enum.IsDefined(typeof(Role), user.Role))
            {
                requests = await _requestRepository.GetAllRequestByUserId(user.Id, parameter, trackChange);
            }
            else
            {
                throw new UnauthorizedAccessException();
            }
            var requestsResponse = _mapper.Map<List<RequestResponseDTO>>(requests);
            var count = await _requestRepository.CountAll(parameter);
            return new PagedList<RequestResponseDTO>(requestsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<RequestResponseDTO> GetRequest(int id, bool trackChange)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            Request request = null;
            if (user.Role == Role.Adminstrator)
            {
                request = await _requestRepository.GetRequestById(id, trackChange);
            }
            else if (Enum.IsDefined(typeof(Role), user.Role))
            {
                request = await _requestRepository.GetRequestByIdAndUserId(id, user.Id, trackChange);
            }
            else
            {
                throw new UnauthorizedAccessException();
            }
            if (request is null)
            {
                throw new RequestNotFoundException(id);
            }

            var requestResponse = _mapper.Map<RequestResponseDTO>(request);
            return requestResponse;
        }        

        public async Task<PagedList<RequestResponseDTO>> GetAllRequestByUserId(string userId, RequestParameter parameter, bool trackChange)
        {
            var requests = await _requestRepository.GetAllRequestByUserId(userId, parameter, trackChange);
            var requestsResponse = _mapper.Map<List<RequestResponseDTO>>(requests);
            var count = await _requestRepository.CountByCondition(cs => cs.CreatedByUserId == userId, parameter);
            return new PagedList<RequestResponseDTO>(requestsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }       

        public async Task<bool> CreateRequest(RequestCreateRequestDTO requestDTO)
        {
            var request = _mapper.Map<Request>(requestDTO);
            request.Status = UserRequestStatus.Pending;
            _requestRepository.Create(request);
            await _requestRepository.SaveAsync();
            // Send Notification to admin
            var requestNotification = new NotificationCreateRequestDTO
            {
                Title = $"New {request.Type} request",
                Description = $"New {request.Type} request have been sent Pending",
                RelatedLink = $"/{request.Id}",
                Type = NotificationType.Request
            };
            await _notificationServices.CreateNotification(requestNotification);
            return true;
        }

        public async Task<bool> DeleteRequest(int id)
        {
            var request = await _requestRepository.GetRequestById(id, trackChange: true);
            if (request is null)
            {
                throw new RequestNotFoundException(id);
            }
            _requestRepository.Delete(request);
            await _requestRepository.SaveAsync();
            return true;
        }

        public async Task<bool> UpdateRequest(int id, RequestUpdateRequestDTO requestDTO)
        {
            var request = await _requestRepository.GetRequestById(id, trackChange: true);
            if (request is null)
            {
                throw new RequestNotFoundException(id);
            }
            _mapper.Map(requestDTO, request);
            await _requestRepository.SaveAsync();
            // Send Notification To User
            var requestInfoUpdateNotification = new NotificationCreateRequestDTO
            {
                Title = $"Your {request.Type} request have updated information",
                RelatedUserId = request.CreatedByUserId,
                Description = $"Your {request.Type} request have updated information, Status: {request.Status}",
                RelatedLink = $"/{request.Id}",
                Type = NotificationType.RequestInfoUpdate
            };
            await _notificationServices.CreateNotification(requestInfoUpdateNotification);
            return true;
        }
    }
}
