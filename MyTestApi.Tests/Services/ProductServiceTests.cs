using Moq;
using Xunit;
using MyTestApi.Services.Implementations;
using MyTestApi.Repositories.Interfaces;
using MyTestApi.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MyTestApi.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockRepo;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly ProductService _service;

        public ProductServiceTests()
        {
            _mockRepo = new Mock<IProductRepository>();
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();

            // HttpContext simülasyonu: Varsayılan olarak bir kullanıcı adı dönmesini sağlayalım
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, "TestUser")
            }, "mock"));

            var httpContext = new DefaultHttpContext();
            httpContext.User = user;

            _mockHttpContextAccessor.Setup(h => h.HttpContext).Returns(httpContext);

            // Servisi her iki bağımlılıkla başlatıyoruz
            _service = new ProductService(_mockRepo.Object, _mockHttpContextAccessor.Object);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsProduct_WhenFound()
        {
            // Arrange
            var expectedProduct = new Product { Id = 1, Name = "Laptop", Price = 50000 };
            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(expectedProduct);

            // Act
            var result = await _service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Laptop", result?.Name);
        }

        [Fact]
        public async Task CreateAsync_SetsAuditFieldsAndCallsRepo()
        {
            // Arrange
            var product = new Product { Name = "Phone", Price = 20000 };
            _mockRepo.Setup(r => r.AddAsync(It.IsAny<Product>())).ReturnsAsync((Product p) => p);

            // Act
            var result = await _service.CreateAsync(product);

            // Assert
            Assert.Equal("TestUser", result.CreatedBy); // Service içindeki GetCurrentUsername çalışmalı
            Assert.NotNull(result.CreatedAt);
            _mockRepo.Verify(r => r.AddAsync(product), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ReturnsTrue_WhenProductExists()
        {
            // Arrange
            var existingProduct = new Product { Id = 1, Name = "Old Name", Price = 100 };
            var updatedData = new Product { Name = "New Name", Price = 200 };

            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);

            // Act
            var result = await _service.UpdateAsync(1, updatedData);

            // Assert
            Assert.True(result);
            Assert.Equal("New Name", existingProduct.Name);
            Assert.Equal("TestUser", existingProduct.UpdatedBy);
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Product>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ReturnsFalse_WhenProductNotFound()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Product?)null);

            // Act
            var result = await _service.UpdateAsync(99, new Product());

            // Assert
            Assert.False(result);
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Product>()), Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ReturnsTrue_AndCallsRepo_WhenFound()
        {
            // Arrange
            var product = new Product { Id = 1 };
            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            // Act
            var result = await _service.DeleteAsync(1);

            // Assert
            Assert.True(result);
            _mockRepo.Verify(r => r.DeleteAsync(product), Times.Once);
        }
    }
}