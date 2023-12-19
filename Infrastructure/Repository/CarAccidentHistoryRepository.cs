using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInsurance;
using Application.DTO.CarStolenHistory;
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
    public class CarAccidentHistoryRepository : CarHistoryRepository<CarAccidentHistory, CarAccidentHistoryParameter>
    {
        protected ApplicationDBContext repositoryContext;
        public CarAccidentHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public override async Task<IEnumerable<CarAccidentHistory>> GetAllCarHistorys(CarAccidentHistoryParameter parameter, bool trackChange)
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

        public override async Task<CarAccidentHistory> GetCarHistoryById(int id, bool trackChange)
        {
            var query = FindByCondition(x => x.Id == id, trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .SingleOrDefaultAsync();
        }

        public override async Task<IEnumerable<CarAccidentHistory>> GetCarHistorysByCarId(string vinId, CarAccidentHistoryParameter parameter, bool trackChange)
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

        public override async Task<IEnumerable<CarAccidentHistory>> GetCarHistorysByUserId(string userId, CarAccidentHistoryParameter parameter, bool trackChange)
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

        public override async Task<IEnumerable<CarAccidentHistory>> GetCarHistorysByOwnCompany(List<string> carIds, CarAccidentHistoryParameter parameter, bool trackChange)
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

        public override async Task<IEnumerable<CarAccidentHistory>> GetCarHistorysByDataProviderId(int dataProviderId, CarAccidentHistoryParameter parameter, bool trackChange)
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

        public override IQueryable<CarAccidentHistory> Filter(IQueryable<CarAccidentHistory> query, CarAccidentHistoryParameter parameter)
        {
            if (parameter.VinId != null)
            {
                query = query.Where(x => x.CarId.ToLower().Contains(parameter.VinId.ToLower()));
            }
            if (parameter.Location != null)
            {
                query = query.Where(x => x.Location.ToLower().Contains(parameter.Location.ToLower()));
            }
            if (parameter.MinServerity != null)
            {
                query = query.Where(x => x.Serverity >= parameter.MinServerity);
            }
            if (parameter.MaxServerity != null)
            {
                query = query.Where(x => x.Serverity <= parameter.MaxServerity);
            }
            if (parameter.AccidentStartDate != null)
            {
                query = query.Where(x => x.AccidentDate >= parameter.AccidentStartDate);
            }
            if (parameter.AccidentEndDate != null)
            {
                query = query.Where(x => x.AccidentDate <= parameter.AccidentEndDate);
            }
            return query;
        }

        public override IQueryable<CarAccidentHistory> Sort(IQueryable<CarAccidentHistory> query, CarAccidentHistoryParameter parameter)
        {
            query = parameter.SortByLastModified switch
            {
                1 => query.OrderBy(x => x.LastModified),
                -1 => query.OrderByDescending(x => x.LastModified),
                _ => query
            };
            query = parameter.SortByServerity switch
            {
                1 => query.OrderBy(x => x.Serverity),
                -1 => query.OrderByDescending(x => x.Serverity),
                _ => query
            };
            query = parameter.SortByAccidentDate switch
            {
                1 => query.OrderBy(x => x.AccidentDate),
                -1 => query.OrderByDescending(x => x.AccidentDate),
                _ => query
            };

            return query;
        }
    }
}
