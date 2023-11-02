using Application.Common.Models;
using Application.DTO.Car;
using Application.DTO.CarSpecification;
using Application.DTO.Request;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.DBContext;
using Infrastructure.Repository.Extension;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class RequestRepository : BaseRepository<Request>, IRequestRepository
    {
        protected ApplicationDBContext repositoryContext;
        public RequestRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<IEnumerable<Request>> GetAllRequests(RequestParameter parameter, bool trackChange)
        {
            return await FindAll(trackChange)
                            .Filter(parameter)
                            .Sort(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

        //public async Task<IEnumerable<CarSpecification>> GetAllCarModelsTest(CarSpecificationParameter parameter, bool trackChange)
        //{
        //    var carModels = await FindAll(trackChange)
        //                    .Include(x => x.Manufacturer)
        //                    .Skip((parameter.PageNumber - 1) * parameter.PageSize)
        //                    .Take(parameter.PageSize)
        //                    .ToListAsync();
        //    var count = await FindAll(trackChange).CountAsync();
        //    return new PagedList<CarSpecification>(carModels, count, parameter.PageNumber, parameter.PageSize);
        //}

        public async Task<Request> GetRequestById(int id, bool trackChange)
        {
            return await FindByCondition(r => r.Id == id, trackChange)
                            .SingleOrDefaultAsync();
        }        
        
        public async Task<Request> GetRequestByIdAndUserId(int id, string userId, bool trackChange)
        {
            return await FindByCondition(r => r.Id == id && r.CreatedByUserId == userId, trackChange)
                            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<Request>> GetAllRequestByUserId(string userId, RequestParameter parameter, bool trackChange)
        {
            return await FindByCondition(r => r.CreatedByUserId == userId, trackChange)
                            .Filter(parameter)
                            .Sort(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }

    }
}
