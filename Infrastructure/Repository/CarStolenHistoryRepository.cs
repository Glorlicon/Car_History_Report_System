using Application.DTO.CarInsurance;
using Application.DTO.CarStolenHistory;
using Application.Interfaces;
using Domain.Entities;
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
    public class CarStolenHistoryRepository : CarHistoryRepository<CarStolenHistory, CarStolenHistoryParameter>
    {
        protected ApplicationDBContext repositoryContext;
        public CarStolenHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public override async Task<IEnumerable<CarStolenHistory>> GetAllCarHistorys(CarStolenHistoryParameter parameter, bool trackChange)
        {
            var query = FindAll(trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<CarStolenHistory> GetCarHistoryById(int id, bool trackChange)
        {
            var query = FindByCondition(x => x.Id == id, trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .SingleOrDefaultAsync();
        }

        public override async Task<IEnumerable<CarStolenHistory>> GetCarHistorysByCarId(string vinId, CarStolenHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CarId == vinId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarStolenHistory>> GetCarHistorysByUserId(string userId, CarStolenHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUserId == userId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarStolenHistory>> GetCarHistorysByOwnCompany(List<string> carIds, CarStolenHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => carIds.Contains(x.CarId), trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }
        public override async Task<IEnumerable<CarStolenHistory>> GetCarHistorysByDataProviderId(int dataProviderId, CarStolenHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public static IQueryable<CarStolenHistory> Filter(IQueryable<CarStolenHistory> query, CarStolenHistoryParameter parameter)
        {
            if (parameter.VinId != null)
            {
                query = query.Where(x => x.CarId.ToLower().Contains(parameter.VinId.ToLower()));
            }
            if (parameter.Status != null)
            {
                query = query.Where(x => x.Status == parameter.Status);
            }
            return query;
        }

        public static IQueryable<CarStolenHistory> Sort(IQueryable<CarStolenHistory> query, CarStolenHistoryParameter parameter)
        {
            query = parameter.SortByLastModified switch
            {
                1 => query.OrderBy(x => x.LastModified),
                -1 => query.OrderByDescending(x => x.LastModified),
                _ => query
            };
            query = parameter.SortByStatus switch
            {
                1 => query.OrderBy(x => x.Status),
                -1 => query.OrderByDescending(x => x.Status),
                _ => query
            };
            return query;
        }
    }
}
