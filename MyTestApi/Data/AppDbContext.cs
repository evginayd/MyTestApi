using Microsoft.EntityFrameworkCore;
using MyTestApi.Models;

namespace MyTestApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Global Query Filter 


            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
            base.OnModelCreating(modelBuilder);
        }

    }
}