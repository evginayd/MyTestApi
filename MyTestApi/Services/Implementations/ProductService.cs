using MyTestApi.DTOs;
using MyTestApi.Models;             // Product için
using MyTestApi.Repositories.Interfaces;
using MyTestApi.Services.Interfaces;     // IProductService için

namespace MyTestApi.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ProductService(IProductRepository repo, IHttpContextAccessor httpContextAccessor)
        {
            _repo = repo;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetCurrentUsername()
        {
            // Token içindeki Name claim'ini alıyoruz
            return _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Anonymous";
        }

        public async Task<IEnumerable<Product>> GetAllAsync(ProductQueryParameters queryParams)
        {
            return await _repo.GetAllAsync(queryParams);
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            product.CreatedBy = GetCurrentUsername();
            return await _repo.AddAsync(product);
        }

        public async Task<bool> UpdateAsync(int id, Product updatedProduct)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Name = updatedProduct.Name;
            existing.Price = updatedProduct.Price;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = GetCurrentUsername();
            await _repo.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null) return false;

            await _repo.DeleteAsync(product);
            return true;
        }

        public async Task UpdateImagePathAsync(Product product)
        {
            await _repo.UpdateAsync(product);
        } 
    }
}
    