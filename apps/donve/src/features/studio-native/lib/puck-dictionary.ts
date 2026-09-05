import type { Dictionary, Viewports } from "@puckeditor/core";

/** Vietnamese strings for Puck's own UI chrome — every key Puck's `defaultDictionary` (English)
 * defines, per its `lib/dictionary.ts` (checked against the installed `@puckeditor/core@0.23.0`
 * source directly since it isn't part of its public docs). Unknown/future keys fall back to
 * Puck's English default automatically — `Dictionary` is `Partial`. */
export const puckDictionaryVi: Dictionary = {
  "header-publish": "Xuất bản",
  "header-undo": "Hoàn tác",
  "header-redo": "Làm lại",
  "header-toggle-leftsidebar": "Ẩn/hiện panel trái",
  "header-toggle-rightsidebar": "Ẩn/hiện panel phải",
  "header-toggle-menubar": "Ẩn/hiện thanh menu",

  "action-selectparent": "Chọn phần tử cha",
  "action-duplicate": "Nhân bản",
  "action-delete": "Xoá",

  "label-page": "Trang",
  "label-component": "Component",

  "outline-empty": "Chưa có section nào",
  "outline-item-collapse": "Thu gọn",
  "outline-item-expand": "Mở rộng",
  "outline-header-title": "Cấu trúc trang",
  "outline-header-collapseall": "Thu gọn tất cả",
  "outline-item-duplicate": "Nhân bản",
  "outline-item-delete": "Xoá",

  "drawer-category-collapse": "Thu gọn {title}",
  "drawer-category-expand": "Mở rộng {title}",
  "drawer-category-other": "Khác",

  "canvas-noconfig": "Không có cấu hình cho {type}",

  "field-readonly": "Chỉ đọc",
  "field-arrayitem-summary": "Mục #{index}",
  "field-arrayitem-duplicate": "Nhân bản",
  "field-arrayitem-delete": "Xoá",
  "field-external-selectdata": "Chọn dữ liệu",
  "field-external-search": "Tìm kiếm",
  "field-external-togglefilters": "Ẩn/hiện bộ lọc",
  "field-external-item": "Mục ngoài",
  "field-external-result-singular": "{count} kết quả",
  "field-external-result-plural": "{count} kết quả",

  "field-richtext-bold": "In đậm",
  "field-richtext-italic": "In nghiêng",
  "field-richtext-underline": "Gạch chân",
  "field-richtext-strikethrough": "Gạch ngang",
  "field-richtext-blockquote": "Trích dẫn",
  "field-richtext-code-inline": "Code inline",
  "field-richtext-code-block": "Khối code",
  "field-richtext-list-bullet": "Danh sách chấm",
  "field-richtext-list-ordered": "Danh sách số",
  "field-richtext-horizontalrule": "Đường kẻ ngang",
  "field-richtext-align-left": "Căn trái",
  "field-richtext-align-center": "Căn giữa",
  "field-richtext-align-right": "Căn phải",
  "field-richtext-align-justify": "Căn đều",
  "field-richtext-select": "Chọn",
  "field-richtext-headingselect-1": "Heading 1",
  "field-richtext-headingselect-2": "Heading 2",
  "field-richtext-headingselect-3": "Heading 3",
  "field-richtext-headingselect-4": "Heading 4",
  "field-richtext-headingselect-5": "Heading 5",
  "field-richtext-headingselect-6": "Heading 6",
  "field-richtext-alignselect-left": "Trái",
  "field-richtext-alignselect-center": "Giữa",
  "field-richtext-alignselect-right": "Phải",
  "field-richtext-alignselect-justify": "Đều",
  "field-richtext-listselect-bullet": "Danh sách chấm",
  "field-richtext-listselect-ordered": "Danh sách số",

  "viewport-zoom-in": "Phóng to",
  "viewport-zoom-out": "Thu nhỏ",
  "viewport-zoom-auto": "{zoom}% (Tự động)",
  "viewport-toggle-menu": "Ẩn/hiện menu viewport",
  "viewport-switch": "Chuyển sang viewport {label}",
  "viewport-switch-default": "Chuyển viewport",

  // Short on purpose (matches English "Blocks"/"Outline"/"Fields" length) — this is the narrow
  // vertical plugin tab bar, not the breadcrumb/field-label text; "Component"/"Thuộc tính" wrap
  // to 2 lines and visually clip there.
  "plugin-blocks": "Khối",
  "plugin-outline": "Cấu trúc",
  "plugin-fields": "Trường",
  "plugin-components": "Khối",

  "layout-maximize": "phóng to",
  "layout-minimize": "thu nhỏ",

  "loader-loading": "đang tải"
};

/** Same breakpoints Puck ships by default (360/768/1280 — matches the 3-breakpoint contract
 * `component-library.md` already holds every catalog component to), Vietnamese labels only. */
export const puckViewportsVi: Viewports = [
  { width: 360, height: "auto", icon: "Smartphone", label: "Di động" },
  { width: 768, height: "auto", icon: "Tablet", label: "Máy tính bảng" },
  { width: 1280, height: "auto", icon: "Monitor", label: "Máy tính" }
];
