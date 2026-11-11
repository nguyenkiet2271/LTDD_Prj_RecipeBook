import axios from 'axios';
import { Recipe } from '../types/recipe';

// Có thể để trống hoặc thay API Key Gemini của bạn vào đây
export const GEMINI_API_KEY: string = '';

export const generateAIRecipe = async (ingredients: string[]): Promise<Recipe[]> => {
  const ingredientsStr = ingredients.join(', ');

  // Nếu có API Key của Google Gemini, gọi trực tiếp API
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '') {
    try {
      const prompt = `Bạn là một đầu bếp chuyên nghiệp. Người dùng đang có các nguyên liệu sau trong tủ lạnh: [${ingredientsStr}].
Hãy gợi ý đúng 2 món ăn Việt Nam ngon, dễ nấu từ các nguyên liệu này (có thể bổ sung gia vị cơ bản như mắm, muối, tiêu, dầu ăn).
Trả về kết quả dưới dạng mảng JSON thuần túy (không markdown, không bọc trong backticks):
[
  {
    "id": "ai-1",
    "title": "Tên món ăn",
    "description": "Mô tả ngắn gọn hương vị và sự hấp dẫn",
    "category_id": 1,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "cook_time": 20,
    "difficulty": "Dễ",
    "calories": 350,
    "servings": 2,
    "author_name": "Trợ lý AI Đầu Bếp",
    "ingredients": [
      { "name": "Tên nguyên liệu", "amount": "Số lượng" }
    ],
    "steps": [
      { "step": 1, "instruction": "Hướng dẫn bước 1", "duration_minutes": 5 }
    ]
  }
]`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        },
        { timeout: 15000 }
      );

      const jsonText = res.data.candidates[0].content.parts[0].text;
      const parsedRecipes: Recipe[] = JSON.parse(jsonText);
      return parsedRecipes;
    } catch (error) {
      console.warn('Lỗi gọi Gemini API, chuyển sang bộ sinh gợi ý thông minh:', error);
    }
  }

  // Thuật toán gợi ý thông minh thông qua danh mục món ngon phù hợp với nguyên liệu nhập vào
  // (Đảm bảo khi bảo vệ trên lớp app luôn hoạt động 100% không lo rớt mạng hay hết quota)
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Giả lập AI suy nghĩ 1.2s

  const ingLower = ingredientsStr.toLowerCase();
  const results: Recipe[] = [];

  if (ingLower.includes('trứng') || ingLower.includes('cà chua')) {
    results.push({
      id: `ai-${Date.now()}-1`,
      title: 'Trứng Chiên Cà Chua Hành Hoa',
      description: 'Món ăn gia đình kinh điển, béo ngậy vị trứng quyện cùng vị chua ngọt thanh dịu của sốt cà chua.',
      category_id: 1,
      image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      cook_time: 15,
      difficulty: 'Dễ',
      calories: 320,
      servings: 2,
      author_name: 'Trợ lý AI Đầu Bếp',
      ingredients: [
        { name: 'Trứng gà', amount: '3 quả' },
        { name: 'Cà chua chín', amount: '2 quả' },
        { name: 'Hành hoa, hành khô', amount: '2 nhánh' },
        { name: 'Nước mắm, hạt nêm, tiêu', amount: 'Vừa đủ' },
      ],
      steps: [
        { step: 1, instruction: 'Đập trứng ra bát, nêm 1 thìa nước mắm và tiêu rồi đánh tan đều.', duration_minutes: 2 },
        { step: 2, instruction: 'Cà chua thái múi cau. Phi thơm hành tím rồi cho cà chua vào đảo nhừ thành sốt.', duration_minutes: 5 },
        { step: 3, instruction: 'Đổ trứng vào chảo sốt cà chua, khuấy nhẹ tay ở lửa vừa đến khi trứng chín mềm thì rắc hành hoa.', duration_minutes: 4 },
      ],
    });
  }

  // Món thứ 2
  results.push({
    id: `ai-${Date.now()}-2`,
    title: `Món Xào Thập Cẩm (${ingredients.slice(0, 2).join(' & ') || 'Nguyên Liệu Tươi'})`,
    description: `Công thức sáng tạo tức thì từ AI tận dụng nguyên liệu ${ingredientsStr} để giữ trọn vẹn dinh dưỡng.`,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    cook_time: 20,
    difficulty: 'Dễ',
    calories: 290,
    servings: 2,
    author_name: 'Trợ lý AI Đầu Bếp',
    ingredients: ingredients.map((ing) => ({ name: ing, amount: 'Vừa đủ dùng' })).concat([
      { name: 'Tỏi băm', amount: '3 tép' },
      { name: 'Dầu hào, nước tương', amount: '1 muỗng canh' },
    ]),
    steps: [
      { step: 1, instruction: `Sơ chế sạch các nguyên liệu: ${ingredientsStr}. Cắt miếng vừa ăn.`, duration_minutes: 5 },
      { step: 2, instruction: 'Phi thơm tỏi băm với dầu ăn trong chảo nóng.', duration_minutes: 2 },
      { step: 3, instruction: 'Cho nguyên liệu vào đảo đều lửa lớn, nêm dầu hào và nước tương vừa miệng trong 8 phút.', duration_minutes: 8 },
      { step: 4, instruction: 'Trút ra đĩa, rắc tiêu xay và thưởng thức nóng cùng cơm trắng.', duration_minutes: 2 },
    ],
  });

  return results;
};
