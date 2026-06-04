INSERT INTO menus (name, description, price, image_url, stock_quantity)
VALUES
  ('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/americano-ice.svg', 10),
  ('아메리카노(HOT)', '진한 향의 따뜻한 아메리카노', 4000, '/images/americano-hot.svg', 10),
  ('카페라떼', '우유와 에스프레소의 부드러운 조화', 5000, '/images/cafe-latte.svg', 10)
ON CONFLICT (name) DO NOTHING;

INSERT INTO options (menu_id, name, price)
SELECT id, '샷 추가', 500 FROM menus
ON CONFLICT (menu_id, name) DO NOTHING;

INSERT INTO options (menu_id, name, price)
SELECT id, '시럽 추가', 0 FROM menus
ON CONFLICT (menu_id, name) DO NOTHING;
