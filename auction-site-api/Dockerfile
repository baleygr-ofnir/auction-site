ARG DOTNET_VERSION

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build
WORKDIR /src

# Copy csproj and restore
COPY ["auction-site-api.csproj", "./"]
RUN dotnet restore "auction-site-api.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "auction-site-api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION} AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "auction-site-api.dll"]
