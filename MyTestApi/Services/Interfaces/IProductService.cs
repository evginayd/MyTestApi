using Microsoft.EntityFrameworkCore; // ToListAsync ve diğer EF metotları için ŞART
using MyTestApi.Data;               // AppDbContext sınıfı için
using MyTestApi.DTOs;
using MyTestApi.Models;             // Product sınıfı için

namespace MyTestApi.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync(ProductQueryParameters queryParams);
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<bool> UpdateAsync(int id, Product updatedProduct);
        Task<bool> DeleteAsync(int id);
        Task UpdateImagePathAsync(Product product);
    }
}
    