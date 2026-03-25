# Build aşaması
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Proje dosyasını alt klasörden kopyalıyoruz
COPY ["MyTestApi/MyTestApi.csproj", "MyTestApi/"]
RUN dotnet restore "MyTestApi/MyTestApi.csproj"

# Tüm dosyaları kopyalıyoruz
COPY . .
WORKDIR "/src/MyTestApi"
RUN dotnet publish "MyTestApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "MyTestApi.dll"]