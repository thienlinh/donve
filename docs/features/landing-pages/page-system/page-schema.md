# PageSpec

Canonical representation của 1 trang landing "native" (tạo qua Component Library). Trang "custom import" đi theo model khác — xem `custom-import.md`.

## Cấu trúc

```ts
interface PageSpec {
  root: string;
  elements: Record<string, PageElement>;
}

interface PageElement {
  type: string; // componentId trong catalog, vd "hero"
  props: unknown; // validate theo Zod schema của đúng type
  children?: string[]; // thứ tự = thứ tự hiển thị
  visible?: unknown; // điều kiện hiển thị, chỉ dùng ở editor — publish resolve cứng
}
```

Metadata ngoài `PageSpec`: `pageId, goal, funnelStage, slug, locale, tokens (DesignTokens), seo (SeoMeta), trackingPlanRef, componentVersions (map id → componentId@version đã pin)`.

## Patch protocol

JSON Patch (RFC 6902), validate bằng catalog Zod schema trước khi áp dụng:

```json
[
  {
    "op": "replace",
    "path": "/elements/hero-1/props/headline",
    "value": "..."
  },
  {
    "op": "add",
    "path": "/elements/testimonial-2",
    "value": { "type": "testimonial", "props": {} }
  },
  {
    "op": "add",
    "path": "/elements/page-root/children/2",
    "value": "testimonial-2"
  }
]
```

## Streaming

`SpecStreamCompiler` áp patch từng chunk khi AI stream tool call — canvas re-render tự nhiên theo state đổi trong khi AI đang build trang.

## Versioning

`pageVersions.spec` lưu `PageSpec` JSON. HTML publish là artifact suy ra được (SSR từ `PageSpec` + catalog registry đúng version), không phải nguồn sự thật — tái sinh được bất cứ lúc nào (vd sau khi 1 component được sửa lỗi, người dùng chủ động "Recompile").

## Rollback

Trỏ lại `pageVersions.id` cũ → SSR render lại (hoặc dùng artifact HTML cache nếu còn) → publish.
