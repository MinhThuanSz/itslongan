CREATE DATABASE IF NOT EXISTS quotation_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quotation_system;

-- 1. Bảng thông tin công ty
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    website VARCHAR(100),
    email VARCHAR(100),
    logo_path VARCHAR(255),
    tax_code VARCHAR(50),
    stamp_path VARCHAR(255)
);

-- 2. Bảng khách hàng
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    position VARCHAR(100),
    email VARCHAR(100)
);

-- 3. Bảng báo giá
CREATE TABLE quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_no VARCHAR(50) UNIQUE NOT NULL,
    created_date DATE NOT NULL,
    customer_id INT,
    title VARCHAR(255),
    description TEXT,
    creator_name VARCHAR(100),
    creator_phone VARCHAR(50),
    creator_email VARCHAR(100),
    sub_total DECIMAL(15, 2) DEFAULT 0,
    vat_rate INT DEFAULT 10,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 4. Bảng chi tiết hạng mục
CREATE TABLE quotation_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_id INT,
    group_name VARCHAR(255), 
    stt INT,
    image_path VARCHAR(255),
    content TEXT,
    unit VARCHAR(50),
    warranty VARCHAR(50),
    quantity INT,
    unit_price DECIMAL(15, 2),
    total_price DECIMAL(15, 2),
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
);

-- 5. Bảng điều kiện thương mại
CREATE TABLE quotation_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_id INT,
    term_content TEXT,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
);

-- Dữ liệu mẫu công ty
INSERT INTO companies (name, address, phone, website, email, tax_code) 
VALUES ('Công ty TNHH Giải pháp Công Nghệ Long An', '123 Đường ABC, Quận 1, TP. HCM', '0901.234.567', 'www.antigravity.vn', 'contact@antigravity.vn', '0101234567');

-- Dữ liệu mẫu khách hàng
INSERT INTO customers (name, address, contact_person, phone, position, email) 
VALUES ('Công ty TNHH ABC', '456 Đường XYZ, Hà Nội', 'Nguyễn Văn A', '0988.777.666', 'Giám đốc', 'vana@ngh.vn');
