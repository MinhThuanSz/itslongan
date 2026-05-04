# Quotation Management System (ITS Manager)

Hệ thống quản lý báo giá và khối lượng thanh toán chuyên nghiệp, hỗ trợ in PDF và xuất Excel theo mẫu chuẩn A4.

## 1. Công nghệ sử dụng
- **Backend**: Java Spring Boot 3
- **Database**: MySQL (XAMPP/phpMyAdmin)
- **Frontend**: Thymeleaf, HTML/CSS, JavaScript
- **Thư viện Export**: OpenHTMLtoPDF (PDF), Apache POI (Excel)

## 2. Cấu trúc thư mục
- `src/main/java/com/antigravity/quotation/entity`: Các thực thể dữ liệu (Quotation, Customer, Company, etc.)
- `src/main/java/com/antigravity/quotation/repository`: Tầng truy cập dữ liệu (Spring Data JPA)
- `src/main/java/com/antigravity/quotation/service`: Tầng xử lý logic nghiệp vụ và export.
- `src/main/java/com/antigravity/quotation/controller`: Tầng điều hướng và xử lý request.
- `src/main/resources/templates`: Giao diện Thymeleaf.
- `src/main/resources/static`: CSS và JavaScript.

## 3. Hướng dẫn cài đặt và chạy Project

### Bước 1: Chuẩn bị Database
1. Mở **XAMPP Control Panel** và Start **Apache** & **MySQL**.
2. Truy cập `http://localhost/phpmyadmin`.
3. Tạo một database mới tên là `quotation_system`.
4. Import file `database/schema.sql` (hoặc chạy nội dung file đó trong tab SQL) để tạo bảng và dữ liệu mẫu.

### Bước 2: Cấu hình ứng dụng
Mở file `src/main/resources/application.properties` và kiểm tra cấu hình database:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quotation_system?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```
*(Nếu bạn có đặt password cho root, hãy điền vào)*

### Bước 3: Chạy ứng dụng
Sử dụng Maven để chạy project:
```bash
mvn spring-boot:run
```
Hoặc chạy trực tiếp từ IDE (IntelliJ IDEA, Eclipse) bằng cách chạy class `QuotationManagerApplication`.

### Bước 4: Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:8080`

## 4. Các tính năng chính
- **Dashboard**: Thống kê nhanh số lượng báo giá và khách hàng.
- **Quản lý khách hàng**: Thêm, sửa, xóa, tìm kiếm thông tin đơn vị khách hàng.
- **Quản lý báo giá**: 
    - Tạo báo giá mới với giao diện thêm dòng linh hoạt.
    - Tự động tính toán thành tiền và tổng cộng ngay trên giao diện.
    - Hỗ trợ phân nhóm hạng mục (ví dụ: I. Thiết bị, II. Nhân công).
- **In và Xuất file**:
    - **In PDF**: Bố cục chuẩn A4 giống như mẫu thực tế.
    - **Xuất Excel**: Chứa đầy đủ thông tin chi tiết hạng mục.

## 5. Lưu ý
- Project sử dụng **Lombok**, hãy đảm bảo IDE của bạn đã cài đặt plugin Lombok.
- Java Version yêu cầu: **17** trở lên.
