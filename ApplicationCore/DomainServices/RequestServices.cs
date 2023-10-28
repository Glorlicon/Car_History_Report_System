using Application.Common.Models;
using Application.DTO.CarSpecification;
using Application.DTO.Request;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DomainServices
{
    public class RequestServices : IRequestServices
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IMapper _mapper;
        private readonly IAuthenticationServices _authenticationServices;
        public RequestServices(IRequestRepository requestRepository, IMapper mapper, IAuthenticationServices authenticationServices)
        {
            _requestRepository = requestRepository;
            _mapper = mapper;
            _authenticationServices = authenticationServices;
        }

        public async Task<PagedList<RequestResponseDTO>> GetAllRequests(RequestParameter parameter, bool trackChange)
        {
            var requests = await _requestRepository.GetAllRequests(parameter, trackChange);
            var requestsResponse = _mapper.Map<List<RequestResponseDTO>>(requests);
            var count = await _requestRepository.CountAll();
            return new PagedList<RequestResponseDTO>(requestsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<RequestResponseDTO> GetRequest(int id, bool trackChange)
        {
            var request = await _requestRepository.GetRequestById(id, trackChange);
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
            var count = await _requestRepository.CountByCondition(cs => cs.CreatedByUserId == userId);
            return new PagedList<RequestResponseDTO>(requestsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }       
        
        public async Task<PagedList<RequestResponseDTO>> GetAllRequestByCurrentUser(RequestParameter parameter, bool trackChange)
        {
            var user = await _authenticationServices.GetCurrentUserAsync();
            var requests = await _requestRepository.GetAllRequestByUserId(user.Id, parameter, trackChange);
            var requestsResponse = _mapper.Map<List<RequestResponseDTO>>(requests);
            var count = await _requestRepository.CountByCondition(cs => cs.CreatedByUserId == user.Id);
            return new PagedList<RequestResponseDTO>(requestsResponse, count: count, parameter.PageNumber, parameter.PageSize);
        }

        public async Task<bool> CreateRequest(RequestCreateRequestDTO requestDTO)
        {
            var request = _mapper.Map<Request>(requestDTO);
            request.Status = UserRequestStatus.Pending;
            _requestRepository.Create(request);
            await _requestRepository.SaveAsync();
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
            return true;
        }
    }
}
