# Build aşaması
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Proje dosyasını kopyala ve kütüphaneleri yükle
COPY ["MyTestApi.csproj", "./"]
RUN dotnet restore "MyTestApi.csproj"

# Kalan tüm dosyaları kopyala ve yayınla
COPY . .
RUN dotnet publish "MyTestApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render'ın port yönetimi için
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "MyTestApi.dll"]