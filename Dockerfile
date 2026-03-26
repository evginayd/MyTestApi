# Client build aşaması
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# API build aşaması
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["MyTestApi/MyTestApi.csproj", "MyTestApi/"]
RUN dotnet restore "MyTestApi/MyTestApi.csproj"

COPY . .
WORKDIR "/src/MyTestApi"
RUN dotnet publish "MyTestApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=client-build /app/client/dist ./wwwroot

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "MyTestApi.dll"]