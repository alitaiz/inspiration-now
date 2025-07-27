# Hướng dẫn triển khai ứng dụng Inspiration Now

Tài liệu này hướng dẫn cách triển khai ứng dụng React tĩnh (Inspiration Now) lên một máy chủ ảo (VPS) chạy hệ điều hành Ubuntu, sử dụng Nginx làm web server. Ứng dụng sẽ được truy cập qua cổng `8000`.

Lỗi "403 Forbidden" thường xảy ra do Nginx không có quyền đọc các file trong thư mục gốc. Hướng dẫn này đã được cập nhật để khắc phục vấn đề đó.

## Yêu cầu
1.  Một VPS đang chạy Ubuntu (22.04, 24.04 hoặc tương tự).
2.  Quyền truy cập vào VPS qua SSH với một người dùng có quyền `sudo`.
3.  Mã nguồn của ứng dụng đã được đẩy lên một kho chứa trên GitHub.

---

### Bước 1: Kết nối tới VPS

Mở terminal trên máy tính của bạn và kết nối tới VPS bằng lệnh SSH. Thay `your_user` và `your_vps_ip` bằng thông tin của bạn.

```bash
ssh your_user@your_vps_ip
```

---

### Bước 2: Cài đặt Git và Nginx

Chúng ta cần Git để lấy mã nguồn từ GitHub và Nginx để phục vụ trang web.

1.  **Cập nhật danh sách gói:**
    ```bash
    sudo apt update
    ```

2.  **Cài đặt Git và Nginx:**
    ```bash
    sudo apt install git nginx -y
    ```

3.  **Khởi động và kích hoạt Nginx:**
    ```bash
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```

4.  **Kiểm tra trạng thái Nginx để đảm bảo nó đang chạy:**
    ```bash
    sudo systemctl status nginx
    ```
    Bạn sẽ thấy dòng `active (running)`. Nhấn `q` để thoát.

---

### Bước 3: Tải mã nguồn và Cài đặt Quyền

Đây là bước quan trọng nhất để tránh lỗi "403 Forbidden".

1.  **Tạo thư mục gốc cho ứng dụng:**
    ```bash
    sudo mkdir -p /var/www/inspiration-app
    ```

2.  **Clone mã nguồn từ GitHub:**
    Thay `<your_github_repo_url>` bằng URL kho chứa của bạn. **Lưu ý dấu `.` ở cuối lệnh** để clone vào thư mục hiện tại.
    ```bash
    cd /var/www/inspiration-app
    sudo git clone <your_github_repo_url> .
    ```
    *Nếu bạn đã clone trước đó, hãy dùng `sudo git pull` để cập nhật và đảm bảo thư mục không trống.*

3.  **Thiết lập quyền sở hữu và quyền truy cập:**
    Lệnh này cấp quyền cho Nginx (người dùng `www-data`) để đọc các file.
    ```bash
    sudo chown -R $USER:www-data /var/www/inspiration-app
    sudo chmod -R 755 /var/www/inspiration-app
    ```

---

### Bước 4: Cấu hình Nginx

Chúng ta sẽ tạo một "server block" để Nginx biết cách phục vụ ứng dụng của bạn trên cổng `8000`.

1.  **Tạo file cấu hình Nginx mới:**
    ```bash
    sudo nano /etc/nginx/sites-available/inspiration-app
    ```

2.  **Dán nội dung cấu hình sau vào file:**
    Cấu hình này chỉ cho Nginx lắng nghe ở cổng `8000` và phục vụ các file từ thư mục ứng dụng của bạn. Dòng `try_files` rất quan trọng đối với các ứng dụng trang đơn (SPA) như React.

    ```nginx
    server {
        listen 8000;
        listen [::]:8000;

        root /var/www/inspiration-app;

        index index.html;

        server_name _;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    ```
    Nhấn `Ctrl + X`, sau đó `Y`, và `Enter` để lưu và thoát.

3.  **Kích hoạt cấu hình bằng cách tạo một liên kết tượng trưng:**
    *Lưu ý: Nếu file đã tồn tại, lệnh này sẽ báo lỗi. Bạn có thể bỏ qua nếu đã làm trước đó.*
    ```bash
    sudo ln -s /etc/nginx/sites-available/inspiration-app /etc/nginx/sites-enabled/
    ```

4.  **Kiểm tra cú pháp Nginx để đảm bảo không có lỗi:**
    ```bash
    sudo nginx -t
    ```
    Bạn sẽ nhận được thông báo `syntax is ok` và `test is successful`.

5.  **Khởi động lại Nginx để áp dụng thay đổi:**
    ```bash
    sudo systemctl restart nginx
    ```

---

### Bước 5: Mở cổng trên Firewall

Cuối cùng, cho phép firewall (UFW) của Ubuntu chấp nhận các kết nối đến cổng `8000`.

1.  **Cho phép traffic trên cổng 8000:**
    ```bash
    sudo ufw allow 8000/tcp
    ```

2.  **(Tùy chọn) Kích hoạt Firewall nếu chưa bật:**
    ```bash
    sudo ufw enable
    ```

3.  **Kiểm tra trạng thái firewall:**
    ```bash
    sudo ufw status
    ```
    Bạn sẽ thấy `8000/tcp` trong danh sách `ALLOW`.

---

### Bước 6: Hoàn tất!

Mở trình duyệt web của bạn và truy cập vào địa chỉ sau:

`http://your_vps_ip:8000`

Bạn sẽ thấy ứng dụng "Inspiration Now" của mình đang chạy trực tiếp từ VPS.

### Xử lý sự cố (Troubleshooting)

*   **Gặp lỗi 403 Forbidden?**
    1.  Đảm bảo bạn đã chạy đúng các lệnh `chown` và `chmod` ở Bước 3.
    2.  Kiểm tra xem file `index.html` có thực sự tồn tại trong `/var/www/inspiration-app` không bằng lệnh: `ls -l /var/www/inspiration-app`. Bạn phải thấy file `index.html` trong danh sách. Nếu nó nằm trong một thư mục con, cấu hình `root` của Nginx đã sai.

*   **Thấy một trang trắng tinh (Blank Page)?**
    1.  **Vấn đề:** Trình duyệt không thể tự đọc cú pháp của React (JSX) và TypeScript (.tsx). Nó cần mã JavaScript thuần túy.
    2.  **Giải pháp:** Chúng ta đã thêm **Babel** vào `index.html` để dịch mã ngay trên trình duyệt. Chúng ta cũng đã cập nhật các câu lệnh `import` để bao gồm phần mở rộng của file (ví dụ: `App.tsx` thay vì `App`), điều này là cần thiết để trình duyệt tìm đúng file.
    3.  **Kiểm tra:** Đảm bảo bạn đã kéo phiên bản mã nguồn mới nhất. Sau đó, hãy thử xóa bộ nhớ cache của trình duyệt và tải lại trang.

*   **Trang vẫn không tải được?**
    1.  Kiểm tra lại trạng thái của Nginx: `sudo systemctl status nginx`.
    2.  Kiểm tra nhật ký lỗi của Nginx: `tail -f /var/log/nginx/error.log`.
    3.  Kiểm tra xem có dịch vụ nào khác đang dùng cổng `8000` không: `sudo lsof -i :8000`.