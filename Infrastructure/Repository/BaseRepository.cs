using Application.Interfaces;
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
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected ApplicationDBContext repositoryContext;

        public BaseRepository(ApplicationDBContext repositoryContext)
        {
            this.repositoryContext = repositoryContext;
        }

        public IQueryable<T> FindAll(bool trackChanges)
        {
            return !trackChanges ? repositoryContext.Set<T>().AsNoTracking()
                                 : repositoryContext.Set<T>();
        }

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges)
        {
            return !trackChanges ? repositoryContext.Set<T>()
                                                    .Where(expression)
                                                    .AsNoTracking()
                                 : repositoryContext.Set<T>()
                                                    .Where(expression);
        }

        public async Task<int> CountAll()
        {
            return await FindAll(false).CountAsync();
        }

        public async Task<int> CountByCondition(Expression<Func<T, bool>> expression)
        {
            return await FindByCondition(expression, false).CountAsync();
        }
        public async Task<bool> IsExist(Expression<Func<T, bool>> expression)
        {
            return await repositoryContext.Set<T>().AnyAsync(expression);
        }

        public bool IsExistNotAsync(Expression<Func<T, bool>> expression)
        {
            return repositoryContext.Set<T>().Any(expression);
        }

        public virtual async Task<IEnumerable<T>> GetAll(bool trackChange)
        {
            return await FindAll(trackChange).ToListAsync();
        }
        public virtual void Create(T entity)
        {
            repositoryContext.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            repositoryContext.Set<T>().Remove(entity);
        }

        public void Update(T entity)
        {
            repositoryContext.Set<T>().Update(entity);
        }

        public Task SaveAsync()
        {
            return repositoryContext.SaveChangesAsync();
        }

        public void Attach(object obj)
        {
            repositoryContext.Attach(obj);
        }
    }
}
