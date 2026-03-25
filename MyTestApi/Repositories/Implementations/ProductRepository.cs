using Microsoft.EntityFrameworkCore; // ToListAsync için
using MyTestApi.Data;               // AppDbContext için
using MyTestApi.Models;             // Product için
using MyTestApi.Repositories.Interfaces; // IProductRepository için
using System.Linq.Dynamic.Core;
using MyTestApi.DTOs;

namespace MyTestApi.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductRepository(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;

        }

        public async Task<IEnumerable<Product>> GetAllAsync(ProductQueryParameters queryParams)
        {
            var query = _context.Products.AsQueryable();
            // Filtering 
            if (!string.IsNullOrEmpty(queryParams.Search))
            {
                string searchLower = queryParams.Search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchLower));
            }

            // Sorting 
            if (!string.IsNullOrEmpty(queryParams.SortBy))
            {
                string sortExpression = queryParams.SortBy;
                if (queryParams.Desc) sortExpression += " descending";

                query = query.OrderBy(sortExpression); // uses System.Linq.Dynamic.Core
            }

            // Pagination 
            query = query
                .Skip((queryParams.Page - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize);

            return await query.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            product.IsDeleted = true;
            product.DeletedAt = DateTime.UtcNow;
            product.DeletedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateImagePathAsync(Product product)
        {
            await _context.AddAsync(product);
        }
    }
}