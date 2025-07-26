
# Hướng dẫn triển khai ứng dụng Inspiration Now

Tài liệu này hướng dẫn cách triển khai ứng dụng React tĩnh (Inspiration Now) lên một máy chủ ảo (VPS) chạy hệ điều hành Ubuntu, sử dụng Nginx làm web server. Ứng dụng sẽ được truy cập qua cổng `8000`.

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

3.  **Kiểm tra trạng thái Nginx để đảm bảo nó đang chạy:**
    ```bash
    sudo systemctl status nginx
    ```
    Bạn sẽ thấy dòng `active (running)`. Nhấn `q` để thoát.

---

### Bước 3: Clone mã nguồn từ GitHub

1.  **Tạo thư mục chứa ứng dụng:**
    Chúng ta sẽ đặt các file trong thư mục `/var/www/`.
    ```bash
    sudo mkdir -p /var/www/inspiration-app
    ```

2.  **Thay đổi quyền sở hữu thư mục:**
    Điều này cho phép bạn clone mã nguồn mà không cần dùng `sudo`.
    ```bash
    sudo chown -R $USER:$USER /var/www/inspiration-app
    ```

3.  **Điều hướng tới thư mục và clone dự án:**
    Thay `<your_github_repo_url>` bằng URL kho chứa của bạn. Dấu `.` ở cuối lệnh để clone vào thư mục hiện tại.
    ```bash
    cd /var/www/inspiration-app
    git clone <your_github_repo_url> .
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
            # Cố gắng phục vụ file được yêu cầu, nếu không tìm thấy, trả về index.html
            try_files $uri $uri/ /index.html;
        }
    }
    ```
    Nhấn `Ctrl + X`, sau đó `Y`, và `Enter` để lưu và thoát.

3.  **Kích hoạt cấu hình bằng cách tạo một liên kết tượng trưng:**
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

2.  **(Tùy chọn) Kiểm tra trạng thái firewall:**
    ```bash
    sudo ufw status
    ```
    Bạn sẽ thấy `8000/tcp` trong danh sách `ALLOW`.

---

### Bước 6: Hoàn tất!

Mở trình duyệt web của bạn và truy cập vào địa chỉ sau:

`http://your_vps_ip:8000`

Bạn sẽ thấy ứng dụng "Inspiration Now" của mình đang chạy trực tiếp từ VPS.
