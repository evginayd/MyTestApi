namespace MyTestApi.DTOs
{
    public class ProductQueryParameters
    {
        const int maxPageSize = 50;
        private int _pageSize = 10;

        public int Page { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > maxPageSize) ? maxPageSize : value;
        }

        public string? Search { get; set; }
        public string? SortBy { get; set; } // "name", "price" 
        public bool Desc { get; set; } = false;
    }
}