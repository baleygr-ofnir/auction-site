using auction_site_api.Core.Services;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace auction_site_api.Workers;

public class AuctionExpiryWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    
    public AuctionExpiryWorker(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var auctionService = scope.ServiceProvider.GetRequiredService<AuctionService>();
                
                var expiredAuctions = await auctionService.FindAsync(auction => auction.IsActive && auction.EndTime <= DateTime.UtcNow);

                foreach (var expiredAuction in expiredAuctions)
                {
                    expiredAuction.IsActive = false;
                    
                    await auctionService.Update(expiredAuction.Id, expiredAuction);
                }
            }
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}