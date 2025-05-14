using FinTrack.Server.Models;
using FinTrack.Server.Models.Domain;

public class UserSeeder
{
    protected readonly FinTrackDbContext dbContext;
    public UserSeeder(FinTrackDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public void InsertUser()
    {
        var mockUsers = new List<User>
        {
            new User { UserId = 1, Email = "john.doe@example.com", FullName = "John Doe", PasswordHash = "hashed_password_1", CreatedAt = DateTime.UtcNow },
            new User { UserId = 2, Email = "jane.smith@example.com", FullName = "Jane Smith", PasswordHash = "hashed_password_2", CreatedAt = DateTime.UtcNow },
            new User { UserId = 3, Email = "alex.johnson@example.com", FullName = "Alex Johnson", PasswordHash = "hashed_password_3", CreatedAt = DateTime.UtcNow },
            new User { UserId = 4, Email = "chris.brown@example.com", FullName = "Chris Brown", PasswordHash = "hashed_password_4", CreatedAt = DateTime.UtcNow },
            new User { UserId = 5, Email = "sam.wilson@example.com", FullName = "Sam Wilson", PasswordHash = "hashed_password_5", CreatedAt = DateTime.UtcNow }
        };

        // Add users to the database
        dbContext.Users.AddRange(mockUsers);
        dbContext.SaveChanges();

        Console.WriteLine("Mock users inserted successfully!");
    }
}