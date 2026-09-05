/**
 * Vietnamese labels for Puck's right-sidebar fields and left-sidebar block picker — both are
 * keyed by raw identifiers (Zod prop names, `componentId`s) that read fine in code but not to an
 * end user editing a landing page. Falls back to a humanized version of the raw key for anything
 * not listed here (new catalog fields don't need this file touched to stay usable).
 */

export const fieldLabelsVi: Record<string, string> = {
  answer: "Câu trả lời",
  authorName: "Tên người nói",
  authorTitle: "Chức danh",
  bio: "Tiểu sử",
  body: "Nội dung",
  caption: "Chú thích",
  claim: "Luận điểm",
  consentText: "Nội dung đồng ý",
  copyrightText: "Nội dung bản quyền",
  ctaHref: "Liên kết nút CTA",
  ctaLabel: "Nhãn nút CTA",
  description: "Mô tả",
  dismissible: "Cho phép đóng",
  embedUrl: "URL video nhúng (YouTube/Vimeo)",
  endsAt: "Thời điểm kết thúc",
  evidenceRef: "Nguồn xác minh",
  expiredText: "Nội dung khi hết hạn",
  feature: "Tính năng",
  features: "Danh sách tính năng",
  heading: "Tiêu đề",
  headline: "Tiêu đề chính",
  highlighted: "Nổi bật",
  html: "Mã HTML",
  iconName: "Tên biểu tượng",
  image: "Hình ảnh",
  images: "Danh sách hình ảnh",
  items: "Danh sách",
  label: "Nhãn",
  linkHref: "Liên kết",
  linkLabel: "Nhãn liên kết",
  links: "Danh sách liên kết",
  logoImage: "Ảnh logo",
  logoText: "Chữ logo",
  logos: "Danh sách logo",
  members: "Thành viên",
  metrics: "Chỉ số",
  name: "Tên",
  newsletterPlaceholder: "Placeholder đăng ký nhận tin",
  nodes: "Danh sách mục",
  period: "Chu kỳ",
  personaOptions: "Tuỳ chọn đối tượng",
  plans: "Các gói",
  points: "Điểm chính",
  poster: "Ảnh xem trước video",
  price: "Giá",
  question: "Câu hỏi",
  quote: "Trích dẫn",
  role: "Vai trò",
  rows: "Danh sách dòng",
  secondaryCtaLabel: "Nhãn nút CTA phụ",
  showEmail: "Hiển thị email",
  showPersona: "Hiển thị đối tượng",
  size: "Kích thước",
  steps: "Các bước",
  subheadline: "Tiêu đề phụ",
  submitLabel: "Nhãn nút gửi",
  tabLabel: "Nhãn tab",
  tabs: "Danh sách tab",
  text: "Văn bản",
  them: "Đối thủ",
  themLabel: "Nhãn đối thủ",
  title: "Tiêu đề",
  triggerLabel: "Nhãn nút kích hoạt",
  us: "Chúng ta",
  usLabel: "Nhãn của chúng ta",
  value: "Giá trị",
  variant: "Biến thể",
  video: "Video",
  videoUrl: "URL video"
};

export const componentLabelsVi: Record<string, string> = {
  hero: "Phần mở đầu",
  nav_bar: "Thanh điều hướng",
  logo_wall: "Dải logo khách hàng",
  testimonial: "Đánh giá khách hàng",
  metric_proof: "Số liệu chứng minh",
  problem_statement: "Vấn đề khách hàng gặp",
  solution_overview: "Tổng quan giải pháp",
  feature_bento: "Tính năng dạng ô",
  feature_grid: "Lưới tính năng",
  feature_tabs: "Tính năng dạng thẻ",
  how_it_works: "Cách hoạt động",
  pricing_table: "Bảng giá",
  comparison_table: "Bảng so sánh",
  faq_accordion: "Câu hỏi thường gặp",
  trust_badges: "Huy hiệu tin cậy",
  lead_form: "Biểu mẫu nhận khách",
  cta_banner: "Dải kêu gọi hành động",
  cta_sticky: "Thanh kêu gọi hành động cố định",
  rich_text_block: "Khối văn bản",
  gallery: "Thư viện ảnh",
  media: "Ảnh/Video",
  countdown_timer: "Đồng hồ đếm ngược",
  team_grid: "Lưới thành viên",
  footer: "Chân trang",
  divider: "Đường phân cách",
  spacer: "Khoảng trắng",
  announcement_bar: "Thanh thông báo",
  raw_html_block: "Khối HTML tuỳ chỉnh"
};

/** `ctaLabel` → "Cta Label" — only reached for a field not yet in `fieldLabelsVi`. */
function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

export function fieldLabelVi(key: string): string {
  return fieldLabelsVi[key] ?? humanize(key);
}

export function componentLabelVi(componentId: string): string {
  return componentLabelsVi[componentId] ?? componentId;
}

export const categoryLabelsVi: Record<string, string> = {
  CTA: "Kêu gọi hành động",
  Comparison: "So sánh",
  Content: "Nội dung",
  Features: "Tính năng",
  Footer: "Chân trang",
  Hero: "Phần mở đầu",
  "Lead capture": "Thu thập khách hàng",
  Nav: "Điều hướng",
  Objection: "Xử lý phản đối",
  Pricing: "Giá",
  Problem: "Vấn đề",
  Process: "Quy trình",
  "Social proof": "Bằng chứng xã hội",
  Solution: "Giải pháp",
  Team: "Đội ngũ",
  Trust: "Tin cậy",
  Urgency: "Khan hiếm",
  Utility: "Tiện ích"
};

export function categoryLabelVi(category: string): string {
  return categoryLabelsVi[category] ?? category;
}
