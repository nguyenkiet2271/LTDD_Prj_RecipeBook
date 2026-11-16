-- =============================================================================
-- BÀI TẬP LỚN MÔN: LẬP TRÌNH THIẾT BỊ DI ĐỘNG (LTDD)
-- ỨNG DỤNG: CHEFMATE - SỔ TAY NẤU ĂN THÔNG MINH
-- NHÓM 20: Nguyễn Đỗ Anh Kiệt (23649011) - Phan Hoàng Nhật Huy (23681041)
-- CƠ SỞ DỮ LIỆU: PostgreSQL (Supabase BaaS)
-- THỜI ĐIỂM XUẤT: 2026-11-16T03:39:50.926Z
-- TỔNG SỐ BẢN GHI: 5 Danh mục & 14 Món ăn
-- =============================================================================

-- 1. KHỞI TẠO EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. XÓA BẢNG CŨ (NẾU CẦN RESET LẠI DỮ LIỆU)
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 3. TẠO BẢNG DANH MỤC (CATEGORIES)
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'restaurant-outline'
);

-- 4. TẠO BẢNG CÔNG THỨC MÓN ĂN (RECIPES)
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  cook_time INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'Dễ',
  calories INTEGER DEFAULT 300,
  servings INTEGER DEFAULT 2,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  author_name TEXT DEFAULT 'Chef Huy',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CẤU HÌNH ROW LEVEL SECURITY (RLS) CHO PHÉP MOBILE APP ĐỌC & GHI
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Allow public insert recipes" ON recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update recipes" ON recipes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete recipes" ON recipes FOR DELETE USING (true);

-- 6. CHÈN DỮ LIỆU BẢNG CATEGORIES (5 Danh mục)
INSERT INTO categories (id, name, icon) VALUES (1, 'Món Sáng', 'sunny-outline');
INSERT INTO categories (id, name, icon) VALUES (2, 'Món Trưa', 'restaurant-outline');
INSERT INTO categories (id, name, icon) VALUES (3, 'Món Chay', 'leaf-outline');
INSERT INTO categories (id, name, icon) VALUES (4, 'Tráng Miệng', 'ice-cream-outline');
INSERT INTO categories (id, name, icon) VALUES (5, 'Eat-Clean', 'fitness-outline');

-- 7. CHÈN DỮ LIỆU BẢNG RECIPES (14 Món ăn)
-- Món 1: Phở Bò Tái Lăn Hà Nội
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '03f3d4ca-f422-4487-98d6-e059bc2de751',
  'Phở Bò Tái Lăn Hà Nội',
  'Món ăn quốc hồn quốc túy với nước dùng thơm lừng hoa hồi, quế cùng thịt bò xào lăn mềm ngọt.',
  1,
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
  45,
  'Trung bình',
  520,
  2,
  '[{"name":"Bánh phở","amount":"500g"},{"name":"Thịt bò thăn","amount":"300g"},{"name":"Xương ống hầm","amount":"1kg"},{"name":"Gừng, hành tím nướng","amount":"2 củ"},{"name":"Hành lá, rau mùi","amount":"1 nắm"}]'::jsonb,
  '[{"step":1,"instruction":"Hầm xương với hành gừng nướng và thảo mộc trong 30 phút để lấy nước ngọt.","duration_minutes":30},{"step":2,"instruction":"Thái mỏng thịt bò, ướp tỏi gừng và xào lăn lửa lớn trong 2 phút.","duration_minutes":2},{"step":3,"instruction":"Trần phở qua nước sôi, xếp thịt bò lên trên rồi chan nước dùng nóng hổi.","duration_minutes":3}]'::jsonb,
  'Chef Huy',
  '2026-11-11T08:18:42.003417+00:00'
);

-- Món 2: Bánh Mì Chảo Thập Cẩm
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '49674727-4398-4dbb-b2b1-1f122a3208ad',
  'Bánh Mì Chảo Thập Cẩm',
  'Bánh mì giòn rụm chấm cùng pate béo ngậy, trứng ốp la lòng đào và xúc xích thơm lừng sốt cà chua đậm đà.',
  1,
  'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
  20,
  'Dễ',
  480,
  2,
  '[{"name":"Bánh mì giòn","amount":"2 ổ"},{"name":"Trứng gà","amount":"2 quả"},{"name":"Pate gan heo","amount":"80g"},{"name":"Xúc xích Đức","amount":"2 cây"},{"name":"Cà chua chín","amount":"2 quả"},{"name":"Hành tây","amount":"1/2 củ"}]'::jsonb,
  '[{"step":1,"instruction":"Thái hành tây và cà chua hạt lựu, xào nhuyễn làm nước sốt cà chua sền sệt đậm đà.","duration_minutes":5},{"step":2,"instruction":"Làm nóng chảo gang, rán xúc xích và ốp la trứng gà còn lòng đào dẻo quánh.","duration_minutes":5},{"step":3,"instruction":"Cho pate vào góc chảo, rưới sốt cà chua nóng hổi, rắc tiêu ngò rí và chấm kèm bánh mì giòn.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 3: Bún Bò Huế Đậm Đà
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'ddd5989e-044a-4ac4-a71d-7fad91ad4f65',
  'Bún Bò Huế Đậm Đà',
  'Hương vị cay nồng đặc trưng xứ Huế với nước dùng thơm lừng sả ruốc, thịt bắp bò mềm ngọt và giò heo giòn sần sật.',
  1,
  'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80',
  50,
  'Khó',
  560,
  4,
  '[{"name":"Bún sợi to","amount":"600g"},{"name":"Bắp bò hoa","amount":"400g"},{"name":"Móng giò heo","amount":"1 cái"},{"name":"Mắm ruốc Huế","amount":"2 thìa canh"},{"name":"Sả cây đập dập","amount":"5 nhánh"},{"name":"Ớt sa tế cay","amount":"1 thìa"},{"name":"Rau chuối bắp bào","amount":"200g"}]'::jsonb,
  '[{"step":1,"instruction":"Luộc sơ móng giò và bắp bò, sau đó hầm cùng sả đập dập trong 35 phút cho thịt mềm ngọt.","duration_minutes":35},{"step":2,"instruction":"Khuấy tan mắm ruốc với nước lạnh, gạn nước trong cho vào nồi nước dùng cùng dầu màu điều và sa tế.","duration_minutes":10},{"step":3,"instruction":"Chần bún qua nước sôi, xếp bắp bò thái lát và giò heo lên mặt, chan nước dùng bốc khói ăn kèm hoa chuối.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 4: Canh Chua Cá Hồi Thanh Mát
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '4f830a2d-120b-41d2-adef-a23754430356',
  'Canh Chua Cá Hồi Thanh Mát',
  'Vị chua thanh tao từ me và cà chua kết hợp thịt cá hồi béo ngậy, bạc hà giòn ngọt xua tan oi bức trưa hè.',
  2,
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  25,
  'Trung bình',
  310,
  4,
  '[{"name":"Lườn/đầu cá hồi","amount":"400g"},{"name":"Cà chua chín","amount":"2 quả"},{"name":"Dứa (thơm)","amount":"1/4 quả"},{"name":"Bạc hà (dọc mùng)","amount":"1 cây"},{"name":"Đậu bắp tươi","amount":"5 quả"},{"name":"Nước cốt me chua","amount":"3 thìa canh"},{"name":"Ngò gai, rau ngổ","amount":"1 nắm"}]'::jsonb,
  '[{"step":1,"instruction":"Phi thơm tỏi băm, xào sơ cà chua và dứa cho tiết nước thơm ngọt và tạo màu tự nhiên.","duration_minutes":4},{"step":2,"instruction":"Đổ nước sôi vào nồi, nêm nước cốt me, đường và nước mắm rồi thả cá hồi vào nấu chín tới.","duration_minutes":8},{"step":3,"instruction":"Cho bạc hà, đậu bắp vào đun sôi bùng, tắt bếp rồi rắc ngò gai, rau ngổ và ớt cắt lát lên trên.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 5: Cơm Tấm Sườn Bì Chả
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'c6d63905-dee7-41dc-86a5-d5fc4cfe38f6',
  'Cơm Tấm Sườn Bì Chả',
  'Hương vị đặc trưng Sài Gòn với miếng sườn nướng óng ánh, thơm lừng mật ong và nước mắm chua ngọt.',
  2,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  40,
  'Trung bình',
  650,
  2,
  '[{"name":"Gạo tấm","amount":"2 bát"},{"name":"Sườn cốt lết","amount":"2 miếng"},{"name":"Chả trứng hấp","amount":"2 miếng"},{"name":"Mỡ hành, đồ chua","amount":"1 bát nhỏ"}]'::jsonb,
  '[{"step":1,"instruction":"Ướp sườn với sả băm, mật ong, nước mắm trong 20 phút rồi nướng chín vàng.","duration_minutes":20},{"step":2,"instruction":"Nấu cơm tấm chín dẻo, làm mỡ hành.","duration_minutes":15},{"step":3,"instruction":"Xới cơm ra đĩa, đặt sườn, chả trứng, rưới mỡ hành và chan nước mắm tỏi ớt.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-11T08:18:42.003417+00:00'
);

-- Món 6: Gà Kho Sả Ớt Miền Tây
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'ee7c9371-dbfe-483a-9f3a-2a0aacd65760',
  'Gà Kho Sả Ớt Miền Tây',
  'Món ăn hao cơm với thịt gà ta dai ngọt, quyện đều sốt sả ớt vàng ươm, thơm lừng và đậm đà khó cưỡng.',
  2,
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  30,
  'Dễ',
  420,
  3,
  '[{"name":"Thịt gà ta","amount":"600g"},{"name":"Sả băm nhỏ","amount":"4 nhánh"},{"name":"Ớt sừng cay","amount":"2 quả"},{"name":"Tỏi băm","amount":"1 củ"},{"name":"Nước mắm ngon","amount":"3 thìa canh"},{"name":"Nước màu dừa","amount":"1 thìa cafe"}]'::jsonb,
  '[{"step":1,"instruction":"Chặt gà miếng vừa ăn, ướp cùng nước mắm, hạt nêm, tiêu và 1/2 lượng sả ớt băm trong 15 phút.","duration_minutes":15},{"step":2,"instruction":"Phi thơm tỏi và lượng sả ớt còn lại, trút thịt gà vào đảo săn trên lửa lớn cho lên màu vàng đẹp.","duration_minutes":5},{"step":3,"instruction":"Thêm chút nước lọc, đậy nắp kho liu riu lửa nhỏ trong 10 phút đến khi nước sốt sệt lại óng ánh.","duration_minutes":10}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 7: Đậu Hũ Tứ Xuyên Sốt Nấm Chay
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '45bac750-8dc9-4c68-bc7e-0d2165c40fda',
  'Đậu Hũ Tứ Xuyên Sốt Nấm Chay',
  'Miếng đậu hũ non mềm mịn tan trong miệng, ngấm đẫm sốt nấm cay nồng sóng sánh chuẩn vị chay thanh tịnh.',
  3,
  'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?auto=format&fit=crop&w=800&q=80',
  20,
  'Dễ',
  240,
  2,
  '[{"name":"Đậu hũ non","amount":"2 hộp"},{"name":"Nấm đùi gà","amount":"100g"},{"name":"Nấm hương tươi","amount":"50g"},{"name":"Tương hột cay chay","amount":"2 thìa"},{"name":"Dầu hào chay","amount":"1 thìa"},{"name":"Bột bắp","amount":"1 thìa cafe"}]'::jsonb,
  '[{"step":1,"instruction":"Cắt đậu hũ non thành từng khối vuông nhỏ, chần sơ qua nước sôi ấm pha muối loãng.","duration_minutes":3},{"step":2,"instruction":"Băm nhỏ nấm đùi gà và nấm hương, xào thơm cùng tương ớt cay, dầu hào chay và chút nước tương.","duration_minutes":7},{"step":3,"instruction":"Thả đậu hũ non vào chảo sốt, hạ nhỏ lửa cho ngấm rồi xuống bột bắp hòa tan để tạo độ sánh mịn.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 8: Cà Tím Nướng Mỡ Hành Chay
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '601a509b-24dd-4658-8965-8de271b46afe',
  'Cà Tím Nướng Mỡ Hành Chay',
  'Cà tím nướng xém cạnh mềm ngọt mọng nước, chan sốt mỡ hành boaro thơm lừng cùng đậu phộng bùi bùi.',
  3,
  'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
  20,
  'Dễ',
  180,
  2,
  '[{"name":"Cà tím thon dài","amount":"2 quả"},{"name":"Hành boaro cắt nhỏ","amount":"1 chén"},{"name":"Đậu phộng rang giã dập","amount":"2 thìa"},{"name":"Nước tương chay tỏi ớt","amount":"3 thìa"},{"name":"Dầu ăn thực vật","amount":"3 thìa canh"}]'::jsonb,
  '[{"step":1,"instruction":"Nướng cà tím trên than hoặc nồi chiên không dầu ở 180 độ C trong 15 phút đến khi vỏ cháy xém, ruột mềm.","duration_minutes":15},{"step":2,"instruction":"Bóc sạch lớp vỏ cháy bên ngoài, dùng nĩa tước nhẹ dọc thân cà cho dễ ngấm gia vị.","duration_minutes":2},{"step":3,"instruction":"Rưới mỡ hành boaro nóng hổi lên cà tím, chan nước tương chua ngọt tỏi ớt và rắc đậu phộng rang giòn.","duration_minutes":3}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 9: Nấm Bào Ngư Chiên Giòn Sả Ớt
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'b7905f47-87cc-42cd-88a2-5bc087a827ad',
  'Nấm Bào Ngư Chiên Giòn Sả Ớt',
  'Món ăn vặt chay giòn rụm bên ngoài dai ngọt bên trong, thơm nức mũi mùi sả ớt chiên vàng rộm.',
  3,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  25,
  'Dễ',
  290,
  3,
  '[{"name":"Nấm bào ngư xám","amount":"300g"},{"name":"Bột chiên giòn","amount":"100g"},{"name":"Sả cây bào mỏng","amount":"3 củ"},{"name":"Muối ớt Tây Ninh","amount":"1 thìa cafe"},{"name":"Dầu ăn thực vật","amount":"200ml"}]'::jsonb,
  '[{"step":1,"instruction":"Nấm ngâm nước muối loãng, vắt thật ráo nước rồi xé sợi vừa ăn.","duration_minutes":5},{"step":2,"instruction":"Khuấy bột chiên giòn với nước sền sệt, nhúng từng miếng nấm áo đều lớp bột mỏng.","duration_minutes":5},{"step":3,"instruction":"Chiên nấm ngập dầu vàng giòn, vớt ra ráo dầu rồi xóc đều cùng sả chiên vàng và muối ớt.","duration_minutes":10}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 10: Chè Bưởi An Giang Giòn Ngon
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'b9bda496-5ac2-436f-ad81-6c8f46159960',
  'Chè Bưởi An Giang Giòn Ngon',
  'Từng viên cùi bưởi giòn sần sật trong suốt không chút vị đắng, hòa cùng đậu xanh bùi bùi và cốt dừa béo ngậy.',
  4,
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  40,
  'Trung bình',
  320,
  4,
  '[{"name":"Cùi bưởi da xanh","amount":"1 quả"},{"name":"Đậu xanh cà vỏ","amount":"150g"},{"name":"Bột năng","amount":"120g"},{"name":"Đường thốt nốt","amount":"200g"},{"name":"Nước cốt dừa","amount":"200ml"},{"name":"Lá dứa thơm","amount":"3 lá"}]'::jsonb,
  '[{"step":1,"instruction":"Cùi bưởi cắt hạt lựu, bóp muối xả nước 5 lần cho hết the, luộc sơ rồi áo bột năng luộc trong suốt giòn tan.","duration_minutes":15},{"step":2,"instruction":"Ngâm đậu xanh nở, hấp chín cùng chút muối và lá dứa cho hạt đậu chín mềm tơi xốp.","duration_minutes":15},{"step":3,"instruction":"Nấu tan đường thốt nốt, hòa bột năng tạo độ sánh rồi trút đậu xanh, cùi bưởi vào khuấy đều, chan cốt dừa béo thơm.","duration_minutes":10}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 11: Panna Cotta Xoài Nhiệt Đới
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'ff2719e8-ef5b-4795-a359-d373f86fd8d1',
  'Panna Cotta Xoài Nhiệt Đới',
  'Tráng miệng phong cách Ý mát lạnh với lớp kem sữa béo ngậy mịn mượt, phủ lớp sốt xoài cát chín thơm lừng.',
  4,
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  30,
  'Dễ',
  260,
  4,
  '[{"name":"Kem tươi Whipping","amount":"200ml"},{"name":"Sữa tươi không đường","amount":"200ml"},{"name":"Lá Gelatin","amount":"3 lá (6g)"},{"name":"Đường cát trắng","amount":"50g"},{"name":"Xoài cát chín ngọt","amount":"200g"}]'::jsonb,
  '[{"step":1,"instruction":"Ngâm mềm lá gelatin trong nước đá lạnh khoảng 10 phút.","duration_minutes":10},{"step":2,"instruction":"Đun ấm sữa tươi, whipping cream và đường, vắt ráo gelatin cho vào khuấy tan rồi rót vào hũ cho vào tủ lạnh.","duration_minutes":10},{"step":3,"instruction":"Xay nhuyễn xoài chín, đun ấm với chút đường làm sốt, rót lên bề mặt panna cotta đã đông và thưởng thức lạnh.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 12: Smoothie Bowl Bơ Chuối Hạt Chia
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '79e0ab0c-e103-4a26-9b6a-41b775fe17b8',
  'Smoothie Bowl Bơ Chuối Hạt Chia',
  'Bữa sáng Eat-Clean giàu năng lượng xanh, vị mát lạnh sảng khoái từ bơ sáp, chuối chín và yến mạch granola giòn bùi.',
  5,
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
  10,
  'Dễ',
  290,
  1,
  '[{"name":"Bơ sáp chín đông đá","amount":"1 quả"},{"name":"Chuối tiêu đông đá","amount":"1 quả"},{"name":"Sữa hạt hạnh nhân","amount":"100ml"},{"name":"Hạt chia hữu cơ","amount":"1 thìa cafe"},{"name":"Ngũ cốc Granola","amount":"2 thìa canh"},{"name":"Dâu tây tươi","amount":"3 quả"}]'::jsonb,
  '[{"step":1,"instruction":"Cắt nhỏ quả chuối và bơ đông lạnh cho vào cối máy xay sinh tố công suất cao.","duration_minutes":2},{"step":2,"instruction":"Thêm sữa hạnh nhân, xay nhuyễn mịn đến khi hỗn hợp đạt độ sánh dẻo đặc như kem gelato.","duration_minutes":3},{"step":3,"instruction":"Đổ sinh tố ra tô sứ, xếp dâu tây cắt lát, rắc hạt chia và granola yến mạch giòn tan lên bề mặt.","duration_minutes":3}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 13: Cá Hồi Áp Chảo Bơ Chanh Măng Tây
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  '8b2851ce-4290-451a-8fb2-67f17960e87d',
  'Cá Hồi Áp Chảo Bơ Chanh Măng Tây',
  'Món ăn chuẩn nhà hàng giàu Omega-3, thịt cá hồi ngọt béo ngấm sốt bơ chanh vàng cùng măng tây giòn ngọt thanh mát.',
  5,
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
  20,
  'Trung bình',
  410,
  2,
  '[{"name":"Phi lê cá hồi tươi","amount":"300g"},{"name":"Măng tây xanh non","amount":"150g"},{"name":"Bơ lạt Anchor","amount":"20g"},{"name":"Nước cốt chanh vàng","amount":"1 thìa canh"},{"name":"Muối biển, tiêu đen","amount":"1 thìa cafe"}]'::jsonb,
  '[{"step":1,"instruction":"Cá hồi thấm khô bằng khăn giấy, ướp chút muối biển và tiêu đen xay hai mặt trong 5 phút.","duration_minutes":5},{"step":2,"instruction":"Áp chảo mặt da cá trước lửa vừa trong 4 phút cho da giòn rụm, lật mặt thịt áp thêm 2 phút rồi gắp ra đĩa.","duration_minutes":6},{"step":3,"instruction":"Xào nhanh măng tây xanh với bơ tỏi, nấu sốt bơ chanh vàng óng ánh rồi rưới đều lên phi lê cá hồi nóng hổi.","duration_minutes":5}]'::jsonb,
  'Chef Huy',
  '2026-11-13T15:08:40.365402+00:00'
);

-- Món 14: Salad Ức Gà Sốt Mè Rang
INSERT INTO recipes (id, title, description, category_id, image_url, cook_time, difficulty, calories, servings, ingredients, steps, author_name, created_at) VALUES (
  'e7e3b99e-ed2d-41ae-bc9f-57caa40a1168',
  'Salad Ức Gà Sốt Mè Rang',
  'Món ăn chuẩn Eat-Clean giàu protein, thanh mát, hỗ trợ giảm cân và giữ dáng hiệu quả.',
  5,
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  15,
  'Dễ',
  280,
  1,
  '[{"name":"Ức gà áp chảo","amount":"200g"},{"name":"Xà lách Romaine","amount":"100g"},{"name":"Cà chua bi","amount":"5 quả"},{"name":"Sốt mè rang Kewpie","amount":"2 muỗng canh"}]'::jsonb,
  '[{"step":1,"instruction":"Ức gà ướp chút muối tiêu rồi áp chảo vàng đều 2 mặt trong 8 phút.","duration_minutes":8},{"step":2,"instruction":"Rửa sạch rau củ, cà chua bi cắt đôi, xếp ra đĩa.","duration_minutes":3},{"step":3,"instruction":"Thái ức gà thành lát vừa ăn, xếp lên rau và rưới sốt mè rang thưởng thức.","duration_minutes":2}]'::jsonb,
  'Chef Huy',
  '2026-11-11T08:18:42.003417+00:00'
);

