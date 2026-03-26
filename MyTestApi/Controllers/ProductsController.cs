using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyTestApi.Data;
using MyTestApi.DTOs;
using MyTestApi.Models;
using MyTestApi.Services.Interfaces;
using MyTestApi.Services.Implementations;

namespace MyTestApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        private readonly ICloudinaryService _cloudinaryService;

        public ProductsController(IProductService service, IMapper mapper, AppDbContext context, ICloudinaryService cloudinaryService)
        {
            _service = service;
            _mapper = mapper;
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("adminonly")]
        public IActionResult GetAdminData()
        {
            return Ok("Only admin can see this");
        }

        /*
        [HttpGet("test-error")]
        public IActionResult TestError()
        {
            throw new Exception("Simulated crash ");
        }
        */

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll([FromQuery] ProductQueryParameters queryParams)
        {
            var products = await _service.GetAllAsync(queryParams);
            return Ok(_mapper.Map<IEnumerable<ProductDto>>(products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(_mapper.Map<ProductDto>(product));
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create(CreateProductDto createDto)
        {
            var product = _mapper.Map<Product>(createDto);
            var created = await _service.CreateAsync(product);
            var readDto = _mapper.Map<ProductDto>(created);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return CreatedAtAction(nameof(GetById), new
            {
                id = readDto.Id
            }, readDto);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductDto updateDto)
        {
            var product = _mapper.Map<Product>(updateDto);
            var success = await _service.UpdateAsync(id, product);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return success ? NoContent() : NotFound();
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
        [Authorize]
        [HttpPut("restore/{id}")]
        public async Task<IActionResult> Restore(int id)
        {
            var product = await _context.Products.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Id == id && p.IsDeleted);
            if (product == null) return NotFound();
            product.IsDeleted = false;
            product.DeletedAt = null;
            await _context.SaveChangesAsync();
            return Ok("Product restored");
        }

        [HttpPost("{id}/upload-image")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null) return NotFound("Product not found");

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            // Eski resmi Cloudinary'den sil
            if (!string.IsNullOrEmpty(product.ImagePath) && product.ImagePath.Contains("cloudinary"))
            {
                var publicId = _cloudinaryService.GetPublicIdFromUrl(product.ImagePath);
                if (!string.IsNullOrEmpty(publicId))
                    await _cloudinaryService.DeleteImageAsync(publicId);
            }

            // Yeni resmi Cloudinary'ye yükle
            var imageUrl = await _cloudinaryService.UploadImageAsync(file);

            // URL'i DB'ye kaydet
            product.ImagePath = imageUrl;
            await _service.UpdateImagePathAsync(product);
            return Ok(new { imageUrl });
        }

    }
    }