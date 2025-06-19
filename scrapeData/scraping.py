import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# ======================== CẤU HÌNH ========================
BASE_URL = 'https://thuvienphapluat.vn'
START_URL = "https://thuvienphapluat.vn/page/tim-van-ban.aspx?keyword=&area=0&match=True&type=0&status=0&signer=0&sort=1&lan=1&scan=0&org=0&fields=&page=1"


USERNAME = 'lazy123'
PASSWORD = 'lazy123@gm'
TOTAL_PAGES = 3  # Số trang cần cào

# =================== KHỞI TẠO TRÌNH DUYỆT =================
options = Options()
# options.add_argument('--headless')  # Bỏ comment nếu muốn chạy ẩn
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
wait = WebDriverWait(driver, 7)

# ==================== BẮT ĐẦU TỰ ĐỘNG =====================
try:
    print("🚀 Truy cập trang chủ...")
    driver.get(BASE_URL)
    time.sleep(2)  # Đợi trang tải hoàn toàn

    # 1. Đợi form xuất hiện và điền thông tin đăng nhập
    print("📝 Điền thông tin đăng nhập...")
    wait.until(EC.presence_of_element_located((By.ID, "usernameTextBox"))).send_keys(USERNAME)
    wait.until(EC.presence_of_element_located((By.ID, "passwordTextBox"))).send_keys(PASSWORD)

    # 2. Click nút Đăng nhập bằng JavaScript
    print("🔑 Thực hiện đăng nhập...")
    login_button = wait.until(EC.element_to_be_clickable((By.ID, "loginButton")))
    driver.execute_script("arguments[0].click();", login_button)
    time.sleep(2)  # Đợi đăng nhập hoàn tất
    print("✅ Đăng nhập thành công!")

    # Lưu cookie để duy trì trạng thái đăng nhập
    cookies = driver.get_cookies()
    session = requests.Session()
    for cookie in cookies:
        session.cookies.set(cookie['name'], cookie['value'])

    # 3. Nhấp vào nút tìm kiếm để chuyển đến START_URL
    print("🔍 Nhấp vào nút tìm kiếm...")
    search_button = wait.until(EC.element_to_be_clickable((By.ID, "btnKeyWordHome")))
    driver.execute_script("arguments[0].click();", search_button)

    # 4. Đợi trang kết quả tải xong
    print(f"🌐 Đợi trang kết quả tại {START_URL}...")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a[onclick="Doc_CT(MemberGA)"]')))
    print(f"✅ Đã tải trang tìm kiếm văn bản! URL hiện tại: {driver.current_url}")

    # Tạo thư mục chính
    os.makedirs('downloads', exist_ok=True)

    # 5. Xử lý từng trang
    for page in range(1, TOTAL_PAGES + 1):
        print(f"\n📄 Đang xử lý trang {page}...")

        # Tạo thư mục con cho trang
        page_dir = os.path.join('downloads', f'trang_{page}')
        os.makedirs(page_dir, exist_ok=True)

        # Thu thập danh sách liên kết văn bản
        links = driver.find_elements(By.CSS_SELECTOR, 'a[onclick="Doc_CT(MemberGA)"]')
        print(f"🔎 Tìm thấy {len(links)} văn bản trên trang {page}")

        # Lưu danh sách href
        hrefs = [link.get_attribute('href') for link in links]

        # Xử lý từng văn bản
        for href in hrefs:
            try:
                title = href.split('/')[-1].split('.aspx')[0][:80]
                print(f"\n🔗 Đang xử lý: {title}")

                # Mở trang chi tiết văn bản
                driver.get(href)
                time.sleep(2)  # Đợi trang tải hoàn toàn
                wait.until(EC.presence_of_element_located((By.ID, "aTabTaiVe")))

                # Kiểm tra tab "Tải về" có class 'current'
                download_tab = driver.find_element(By.ID, "aTabTaiVe")
                if 'current' not in download_tab.get_attribute('class'):
                    print("🔄 Nhấp tab Tải về...")
                    driver.execute_script("arguments[0].click();", download_tab)
                    time.sleep(2)  # Đợi tab mở

                # Tìm liên kết "Tải Văn bản tiếng Việt"
                vietnamese_link = wait.until(EC.element_to_be_clickable((By.ID, "ctl00_Content_ThongTinVB_vietnameseHyperLink")))
                file_href = vietnamese_link.get_attribute('href')

                if not file_href or file_href == 'javascript:void(0);':
                    raise Exception("Không tìm thấy URL tải hợp lệ")

                if file_href.startswith('/'):
                    file_href = BASE_URL + file_href

                # Tạo tên file dựa trên title
                filename_base = title.replace('/', '_')[:80]  # Thay thế ký tự không hợp lệ
                print(f"⬇️ Tải file: {filename_base}")

                # Tải file bằng session để giữ cookie
                r = session.get(file_href, headers={'User-Agent': 'Mozilla/5.0'})
                content_type = r.headers.get('Content-Type', '')

                # Xác định đuôi file dựa trên Content-Type
                if 'application/pdf' in content_type:
                    extension = '.pdf'
                elif 'application/msword' in content_type or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type:
                    extension = '.doc'
                else:
                    print(f"⚠️ Lỗi: Content-Type không hỗ trợ ({content_type}). Bỏ qua.")
                    continue

                filename = filename_base + extension
                filepath = os.path.join(page_dir, filename)
                print(f"💾 Lưu file: {filename}")

                with open(filepath, 'wb') as f:
                    f.write(r.content)

            except Exception as e:
                print(f"❌ Lỗi khi xử lý văn bản '{title}': {e}")
                continue

        # Chuyển sang trang tiếp theo nếu chưa phải trang cuối
        if page < TOTAL_PAGES:
            try:
                next_page_url = START_URL.rsplit('=', 1)[0] + f'={page + 1}'
                print(f"➡️ Chuyển sang URL: {next_page_url}")
                driver.get(next_page_url)
                time.sleep(2)  # Đợi trang mới tải
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a[onclick="Doc_CT(MemberGA)"]')))
                print(f"✅ Đã chuyển sang trang {page + 1}")
            except Exception as e:
                print(f"❌ Không thể chuyển sang trang tiếp theo: {e}")
                break

    print("\n🎉 XONG! Các file đã được lưu vào các thư mục 'downloads/trang_X'")

except Exception as e:
    print(f"❌ Đã xảy ra lỗi: {e}")
    print(f"📍 URL hiện tại khi lỗi: {driver.current_url}")

finally:
    print("🛑 Đóng trình duyệt...")
    driver.quit()