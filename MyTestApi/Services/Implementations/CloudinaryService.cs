using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using MyTestApi.Services.Interfaces;

namespace MyTestApi.Services.Implementations
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "mytestapi/products",
                Transformation = new Transformation()
                    .Width(800).Height(800).Crop("limit").Quality("auto")
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new Exception($"Cloudinary upload failed: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }

        public async Task DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            await _cloudinary.DestroyAsync(deleteParams);
        }

        public string GetPublicIdFromUrl(string url)
        {
            // Cloudinary URL: https://res.cloudinary.com/{cloud}/image/upload/v123/mytestapi/products/abc.jpg
            // PublicId: mytestapi/products/abc
            var uri = new Uri(url);
            var path = uri.AbsolutePath;
            var uploadIndex = path.IndexOf("/upload/");
            if (uploadIndex == -1) return string.Empty;

            var afterUpload = path[(uploadIndex + 8)..]; // skip "/upload/"
            // Remove version prefix (v123456/)
            if (afterUpload.StartsWith("v") && afterUpload.Contains('/'))
            {
                afterUpload = afterUpload[(afterUpload.IndexOf('/') + 1)..];
            }
            // Remove file extension
            var lastDot = afterUpload.LastIndexOf('.');
            if (lastDot > 0)
                afterUpload = afterUpload[..lastDot];

            return afterUpload;
        }
    }
}
