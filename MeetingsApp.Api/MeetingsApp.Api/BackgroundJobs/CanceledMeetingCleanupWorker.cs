
using MeetingsApp.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace MeetingsApp.Api.BackgroundJobs
{
    public class CanceledMeetingCleanupWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CanceledMeetingCleanupWorker> _logger;

        public CanceledMeetingCleanupWorker(IServiceProvider serviceProvider, ILogger<CanceledMeetingCleanupWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;
                var targetTime = DateTime.Today.AddHours(3); // 03:00 

                // Eğer şu anki zaman 03:00'den sonra ise, bir sonraki günün 03:00'üne ayarla
                if (now > targetTime)
                    targetTime = targetTime.AddDays(1);

                var delay = targetTime - now;

                _logger.LogInformation($"CleanupWorker sleeping for {delay.TotalMinutes} minutes.");

                await Task.Delay(delay, stoppingToken);

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var deletedCount = await dbContext.Database.ExecuteSqlRawAsync(
                                                            "DELETE FROM Meetings WHERE IsCanceled = 1",
                                                            cancellationToken: stoppingToken);

                        _logger.LogInformation($"[CLEANUP] {deletedCount} iptal edilen toplantı silindi.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "İptal edilen toplantılar silinirken hata oluştu.");
                }
            }
        }
    }
}
