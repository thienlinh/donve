XAY KENH VIRAL — LANDING PAGE (ban cuoi, da kiem tra day du)
============================================================

QUAN TRONG: KHONG UPLOAD MOI FILE index.html
--------------------------------------------
Trang nay gom 1 file HTML + 1 thu muc anh/video. Neu chi upload
mot minh index.html thi trang se KHONG co anh, KHONG co video.

Upload NGUYEN CAU TRUC nay len thu muc goc cua xaykenh.funu.com.vn:

    index.html                          <- trang khoa hoc
    chinh-sach-bao-mat.html             <- bat buoc, Meta co kiem tra
    dieu-khoan.html                     <- bat buoc
    og-xay-kenh-viral-nang-cao.jpg      <- anh hien khi share Facebook
    assets/                             <- CA THU MUC 51 file (anh + video)

Giu HTML va thu muc assets NAM CUNG MOT CAP thi duong dan moi dung.


BA CHO CAN DIEN TRUOC KHI CHAY QUANG CAO
----------------------------------------
1. MA XAC MINH DOMAIN (1 cho)
   Trong index.html, tim: DAN-MA-XAC-MINH-DOMAIN-VAO-DAY
   Lay ma tai: Trinh quan ly doanh nghiep Meta -> Bao mat thuong hieu
   -> Mien -> them xaykenh.funu.com.vn -> xac minh bang the meta.

2. COURSE ID GOI CO BAN VA VIP (2 cho)
   Trong index.html, tim: thay bang courseId
   Hien ca 3 goi dung chung ma khoa Nang Cao nen FUNU khong tach
   duoc so lieu tung goi. Xin 2 ma con lai tu team FUNU.

3. FILE /api/dangky.php
   Neu hosting khong co file nay thi sua dong:
       const API_URL = "/api/dangky.php";
   thanh:
       const API_URL = "";
   (Day chi la ban luu du phong, khong anh huong lead ve FUNU.)


BAT BUOC TEST SAU KHI UPLOAD
----------------------------
1. Gui thu 1 lead that -> phai thay man hinh cam on, lead ve FUNU,
   va Meta Pixel Helper bao co su kien Lead.
   Neu bao "Khong ket noi duoc may chu" -> loi CORS, bao team FUNU
   cho phep domain xaykenh.funu.com.vn goi vao api.funu.com.vn.
2. Bam thu 1 video tren dien thoai (phan chua kiem tra duoc o may chu).
3. Mo trang bang 4G that, khong dung wifi, xem toc do.


DONG HO DEM NGUOC
-----------------
Trong index.html tim: HAN_UU_DAI
Hien dat: 2026-08-31T23:59:59+07:00
Sua dong nay moi dot mo ban. Het han dong ho tu an.


DA LAM GI TRONG BAN NAY
-----------------------
- Tach anh/video khoi HTML: tai ban dau 10.4 MB -> 263 KB
- Bo 32 anh nhung trung lap, chuyen JPEG sang WebP
- Sua loi 20 anh trong bang chay khong bao gio hien ra
- Sua loi form dang ky bi dung (loi JavaScript)
- Doi tieu de tranh vi pham chinh sach quang cao Meta
- Them checkbox dong y + trang chinh sach bao mat + dieu khoan
- Them thong tin cong ty: MST 0319111064, dia chi, email
- Bo thong tin chuyen khoan khoi chan trang (van con o man cam on)
- Su kien Meta: PageView, ViewContent, InitiateCheckout, Lead, Contact
- Lead co eventID san sang cho Conversions API
- Loc dang ky rac: kiem tra so dien thoai VN + bay bot an

DA KIEM TRA
-----------
72/72 anh hien du. Khong loi JavaScript tren ca 3 trang. Khong tran
vien o 390px, 768px, 1440px. Link noi bo day du. Form dang ky chay
dung ca 3 luong: khach that, bot, va khi may chu loi.

CHUA KIEM TRA DUOC: video (may chu test thieu bo giai ma H.264).
File video binh thuong, trinh duyet that se phat duoc — nhung chi
nen bam thu 1 video sau khi upload.
