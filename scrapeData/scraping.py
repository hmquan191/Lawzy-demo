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
USERNAME = 'lazy123'
PASSWORD = 'lazy123'

# =================== KHỞI TẠO TRÌNH DUYỆT =================
options = Options()
# options.add_argument('--headless')  # Bỏ comment nếu muốn chạy ẩn
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
wait = WebDriverWait(driver, 20)

# ==================== BẮT ĐẦU TỰ ĐỘNG =====================
print("🚀 Truy cập trang chủ...")
driver.get(BASE_URL)

# 1. Đợi form xuất hiện và điền thông tin đăng nhập
wait.until(EC.presence_of_element_located((By.ID, "usernameTextBox"))).send_keys(USERNAME)
wait.until(EC.presence_of_element_located((By.ID, "passwordTextBox"))).send_keys(PASSWORD)

# 2. Click nút Đăng nhập bằng JavaScript (tránh bị popup chặn)
login_button = wait.until(EC.element_to_be_clickable((By.ID, "loginButton")))
driver.execute_script("arguments[0].click();", login_button)

# 3. Đợi đến khi đăng nhập xong (menu tài khoản xuất hiện)
try:
    wait.until(EC.presence_of_element_located((By.ID, "header_user_menu")))
    print("✅ Đăng nhập thành công!")
except:
    print("❌ Đăng nhập thất bại!")
    driver.quit()
    exit()

# =================== TRUY CẬP TRANG VĂN BẢN ================
START_URL = f"{BASE_URL}/page/tim-van-ban.aspx?keyword=&match=True&area=0"
driver.get(START_URL)
time.sleep(2)

links = driver.find_elements(By.CSS_SELECTOR, 'a[onclick*="Doc_CT"]')
print(f"🔎 Tìm thấy {len(links)} văn bản trên trang đầu")

os.makedirs('downloads', exist_ok=True)

# ==================== XỬ LÝ VĂN BẢN ========================
for link in links:
    try:
        href = link.get_attribute('href')
        title = link.text.strip()[:80]
        print(f"\n🔗 Đang xử lý: {title}")

        driver.get(href)
        time.sleep(2)

        # Bấm tab "Tải về"
        download_tab = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Tải về")))
        driver.execute_script("arguments[0].click();", download_tab)

        # Tìm link file
        file_link = wait.until(EC.presence_of_element_located((By.ID, "ctl00_Content_ThongTinVB_vietnameseHyperLink")))
        file_href = file_link.get_attribute('href')

        if file_href.startswith('/'):
            file_href = BASE_URL + file_href

        filename = file_href.split('=')[-1][:20] + '.pdf'
        filepath = os.path.join('downloads', filename)
        print(f"⬇️  Tải file: {filename}")

        # Tải file
        r = requests.get(file_href)
        with open(filepath, 'wb') as f:
            f.write(r.content)

    except Exception as e:
        print(f"❌ Lỗi khi xử lý văn bản: {e}")
        continue

driver.quit()
print("\n🎉 XONG! Các file đã được lưu vào thư mục 'downloads'")
