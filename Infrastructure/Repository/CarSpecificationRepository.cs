using Application.Interfaces;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarSpecificationRepository : BaseRepository<CarSpecification>, ICarSpecificationRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarSpecificationRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public override async Task<IEnumerable<CarSpecification>> GetAll(bool trackChange)
        {
            return await FindAll(trackChange).Include(x => x.Manufacturer).ToListAsync();
        }

        public async Task<CarSpecification> GetCarModelById(string modelId, bool trackChange)
        {
            return await FindByCondition(cs => cs.ModelID == modelId, trackChange)
                            .Include(x => x.Manufacturer)
                            .SingleOrDefaultAsync();
        }
    }
}
