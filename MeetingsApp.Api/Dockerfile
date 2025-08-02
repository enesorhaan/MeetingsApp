# Build aşaması
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Solution ve projeleri kopyala
COPY . .

# Restore ve publish
RUN dotnet restore "MeetingsApp.Api.sln"
RUN dotnet publish "MeetingsApp.Api/MeetingsApp.Api.csproj" -c Release -o /app/publish

# Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MeetingsApp.Api.dll"]