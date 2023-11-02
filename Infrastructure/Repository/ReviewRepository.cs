﻿using Application.DTO.DataProvider;
using Application.DTO.Request;
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
    public class ReviewRepository : BaseRepository<Review>, IReviewRepository
    {
        protected ApplicationDBContext repositoryContext;
        public ReviewRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<Review> GetReview(string userId, int dataProviderId, bool trackChange)
        {
            return await FindByCondition(r => r.DataProviderId == dataProviderId && r.UserId == userId, trackChange)
                            .SingleOrDefaultAsync();
        }
        public async Task<IEnumerable<Review>> GetAllReview(int dataProviderId, DataProviderReviewParameter parameter, bool trackChange)
        {
            return await FindByCondition(r => r.DataProviderId == dataProviderId, trackChange)
                            //.Filter(parameter)
                            //.Sort(parameter)
                            .Skip((parameter.PageNumber - 1) * parameter.PageSize)
                            .Take(parameter.PageSize)
                            .ToListAsync();
        }
    }
}