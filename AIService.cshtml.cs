using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
 
namespace PlantsInformationWeb.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly 
 
        public AIService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["OpenAI:ApiKey"];
        }
 
 
        public async Task<string> AskAIAsync(string userMessage)
        {
            var data

            var systemPrompt = string.IsNullOrEmpty(context)
        ? @"Bạn là Plant Assistant 🌱 – một trợ lý AI thân thiện, chuyên về cây trồng, sinh học, và chăm sóc thực vật.  
        Bạn có thể chào hỏi, cảm ơn hoặc giao tiếp ngắn gọn để tạo cảm giác tự nhiên.  
        Tuy nhiên, khi người dùng hỏi về chủ đề không liên quan đến cây trồng, nông nghiệp hoặc sinh học,  
        hãy lịch sự từ chối bằng cách hướng họ quay lại chủ đề cây trồng.  
        Ví dụ: 'Mình không rành về chủ đề đó lắm, nhưng nếu bạn muốn nói về cây trồng thì mình rất sẵn lòng giúp! 🌿'  
 
        Trả lời bằng văn bản thuần túy, không dùng bảng hay markdown, chỉ chia dòng rõ ràng và dễ đọc."
            : $@"Bạn là chuyên gia cây trồng. Dưới đây là dữ liệu nội bộ:\n{context}\n
        Hãy dựa vào đó để trả lời chính xác, thân thiện và ngắn gọn.  
        Không dùng bảng hay markdown, chỉ văn bản thuần túy.  
        Nếu câu hỏi không liên quan đến cây trồng, hãy nhẹ nhàng từ chối và hướng người dùng quay lại chủ đề cây trồng,  
        ví dụ: 'Mình không rành lắm về điều đó, nhưng về cây trồng thì mình biết kha khá đấy! 🌸'";
 
 
            var requestBody = new
            {
                model = "gpt-oss-20b",
                messages = new[]
                {
            new { role = "system", content = systemPrompt },
            new { role = "user", content = userMessage }
        },
                temperature = 0.6,
                max_tokens = 300
            };
 
            var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
            request.Headers.Add("Authorization", $"Bearer {_apiKey}");
            request.Headers.Add("HTTP-Referer", "http://localhost:5291/");
            request.Headers.Add("X-Title", "PlantsInformationWeb");
            request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
 
            var response = await _httpClient.SendAsync(request);
            var responseString = await response.Content.ReadAsStringAsync();
 
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"[AI ERROR] {response.StatusCode}: {responseString}");
                return "Xin lỗi, hiện tại hệ thống AI đang bận. 🌱";
            }
 
            using var jsonDoc = JsonDocument.Parse(responseString);
            var content = jsonDoc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();
 
            return content.Trim();
        }
 
    }
}
 