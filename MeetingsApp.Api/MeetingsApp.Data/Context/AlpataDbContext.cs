using AlpataMeetings.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace AlpataMeetings.Data.Context
{
    public class AlpataDbContext : DbContext
    {
        public AlpataDbContext(DbContextOptions<AlpataDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
