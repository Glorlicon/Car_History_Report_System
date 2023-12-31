﻿using Application.DTO.CarInspectionHistory;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarInspectionHistoryRepository : CarHistoryRepository<CarInspectionHistory, CarInspectionHistoryParameter>
    {
        protected ApplicationDBContext repositoryContext;
        public CarInspectionHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public override void Create(CarInspectionHistory entity)
        {
            var isInspectionNumberExist = IsExistNotAsync(x => x.InspectionNumber == entity.InspectionNumber);
            if (isInspectionNumberExist)
            {
                throw new InspectionNumberExistException();
            }
            base.Create(entity);
        }

        public override async Task<IEnumerable<CarInspectionHistory>> GetAllCarHistorys(CarInspectionHistoryParameter parameter, bool trackChange)
        {
            var query = FindAll(trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Include(x => x.CarInspectionHistoryDetail)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<CarInspectionHistory> GetCarHistoryById(int id, bool trackChange)
        {
            var query = FindByCondition(x => x.Id == id, trackChange);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Include(x => x.CarInspectionHistoryDetail)
                              .SingleOrDefaultAsync();
        }

        public override async Task<IEnumerable<CarInspectionHistory>> GetCarHistorysByCarId(string vinId, CarInspectionHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CarId == vinId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Include(x => x.CarInspectionHistoryDetail)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInspectionHistory>> GetCarHistorysByUserId(string userId, CarInspectionHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUserId == userId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Include(x => x.CarInspectionHistoryDetail)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override async Task<IEnumerable<CarInspectionHistory>> GetCarHistorysByDataProviderId(int dataProviderId, CarInspectionHistoryParameter parameter, bool trackChange)
        {
            var query = FindByCondition(x => x.CreatedByUser.DataProviderId == dataProviderId, trackChange);
            query = Filter(query, parameter);
            query = Sort(query, parameter);
            return await query.Include(x => x.CreatedByUser)
                              .ThenInclude(x => x.DataProvider)
                              .Include(x => x.CarInspectionHistoryDetail)
                              .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                              .Take(parameter.PageSize)
                              .ToListAsync();
        }

        public override IQueryable<CarInspectionHistory> Filter(IQueryable<CarInspectionHistory> query, CarInspectionHistoryParameter parameter)
        {
            if (parameter.CarId != null)
                query = query.Where(x => x.CarId.Contains(parameter.CarId));
            if (parameter.InspectionNumber != null)
                query = query.Where(x => x.InspectionNumber.Contains(parameter.InspectionNumber));
            if (parameter.InspectionStartDate != null)
                query = query.Where(x => x.InspectDate >= parameter.InspectionStartDate);
            if (parameter.InspectionEndDate != null)
                query = query.Where(x => x.InspectDate <= parameter.InspectionEndDate);
            return query;
        }
    }
}
