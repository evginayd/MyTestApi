using Microsoft.AspNetCore.Http;

namespace MyTestApi.Services.Interfaces
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task DeleteImageAsync(string publicId);
        string GetPublicIdFromUrl(string url);
    }
}
