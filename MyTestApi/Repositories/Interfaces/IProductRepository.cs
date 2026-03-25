using Microsoft.EntityFrameworkCore; // ToListAsync ve diğer EF metotları için ŞART
using MyTestApi.Data;  // AppDbContext sınıfı için
using MyTestApi.DTOs;
using MyTestApi.Models;             // Product sınıfı için
using MyTestApi.Repositories.Interfaces; // IProductRepository'yi tanıması lazım
using MyTestApi.Services.Interfaces;     // IProductService'i tanıması lazım

namespace MyTestApi.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync(ProductQueryParameters queryParams);
        Task<Product?> GetByIdAsync(int id);
        Task<Product> AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Product product);
        Task UpdateImagePathAsync(Product product);
    }

}
