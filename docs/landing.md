> **Đã superseded.** Đây là bản vision-dump ban đầu (generic, không đặc thù thị trường Việt Nam, chưa có PageSpec/component catalog/data model cụ thể). Thiết kế hiện hành, đã quyết định và đang thi công, nằm ở `docs/features/landing-pages/README.md` (bắt đầu đọc từ đó) — bao gồm PageSpec/json-render catalog (~27 component), canvas Puck, agent pipeline cụ thể, data model, roadmap. File này giữ lại chỉ để tham khảo lịch sử ý tưởng ban đầu, không phải đặc tả hiện hành. Ý tưởng ở đây chưa được các doc mới claim rõ ràng, có thể còn giá trị nếu ai đó muốn cân nhắc thêm: mô hình "8 AI engine"/4-phase generic (khác cách chia agent hiện tại), và phần Business Analyzer hỏi-thêm câu hỏi tự do (ICP/JTBD/USP...) chi tiết hơn Research Agent hiện tại mô tả ở `ai/agent-pipeline.md`.

---

Nếu mục tiêu của bạn là xây dựng **một AI Landing Page Builder có khả năng tạo ra landing page thực sự tốt**, chứ không chỉ là “AI viết HTML + vài section đẹp”, thì tôi sẽ không bắt đầu từ UI builder.

Tôi sẽ xây nó như một **AI Landing Page Intelligence Platform** gồm 5 lớp:

> **Business → Marketing Strategy → Content → UX/UI → SEO/Performance → Code/Publish → Measurement → AI Optimization**

Điểm quan trọng nhất: **AI không nên bắt đầu bằng việc “vẽ landing page”. AI phải hiểu business và mục tiêu chuyển đổi trước.**

---

# 1. Hãy định nghĩa sản phẩm đúng ngay từ đầu

Thay vì:

> “Nhập prompt → AI tạo landing page”

nên là:

> **“Nhập business/product → AI nghiên cứu, chiến lược hóa, viết nội dung, thiết kế, build, kiểm tra và tối ưu landing page.”**

Ví dụ user nhập:

> Tôi bán phần mềm quản lý đơn hàng cho shop online.

AI phải tự suy luận / hỏi thêm:

- Sản phẩm là gì?
- ICP là ai?
- B2B/B2C?
- Pain points?
- JTBD?
- USP?
- Competitors?
- Giá?
- Conversion goal?
- Traffic source?
- Search intent?
- Brand positioning?
- Tone of voice?
- Trust signals?
- CTA?
- Objections?
- Buying journey?

Sau đó mới bắt đầu xây page.

---

# 2. Kiến trúc tổng thể tôi khuyên bạn xây

Có thể hình dung:

```text
                    ┌──────────────────────┐
                    │      USER INPUT      │
                    │ Product / Business   │
                    │ URL / Brief / Files  │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │  BUSINESS ANALYZER   │
                    │ ICP / USP / JTBD      │
                    │ Pain / Objection      │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ MARKETING STRATEGIST  │
                    │ Positioning           │
                    │ Funnel                │
                    │ Messaging             │
                    │ Offer                 │
                    └──────────┬───────────┘
                               ↓
              ┌────────────────┴────────────────┐
              ↓                                 ↓
      ┌───────────────┐                 ┌───────────────┐
      │ CONTENT ENGINE│                 │ DESIGN ENGINE │
      │ Copywriting    │                 │ UI / UX       │
      │ SEO            │                 │ Layout        │
      │ CRO            │                 │ Brand         │
      └───────┬───────┘                 └───────┬───────┘
              └────────────────┬────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │ PAGE ARCHITECT       │
                    │ Section structure    │
                    │ Components           │
                    │ Conversion flow      │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │      AI BUILDER      │
                    │ HTML / React / CSS   │
                    │ Responsive           │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ QUALITY ENGINE       │
                    │ SEO / UX / CRO       │
                    │ Accessibility        │
                    │ Performance          │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ PUBLISH / ANALYTICS  │
                    │ Domain / Tracking    │
                    │ Conversion           │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ OPTIMIZATION AGENT   │
                    │ A/B test / Improve   │
                    └──────────────────────┘
```

Đây mới là hướng tôi nghĩ có tiềm năng tạo ra sản phẩm mạnh.

---

# 3. Có 8 engine AI bạn nên xây

## Engine 1 — Business Intelligence

Đây là tầng quan trọng nhất.

AI nhận:

- URL
- Product description
- PDF
- Product documentation
- Brand guideline
- Existing website
- Competitor URLs
- Customer reviews
- Testimonials
- Pricing
- Product screenshots

Sau đó tạo một **Business Knowledge Graph**.

Ví dụ:

```text
PRODUCT
 ├── Category
 ├── Features
 ├── Benefits
 ├── Differentiators
 ├── Pricing
 └── Integrations

CUSTOMER
 ├── ICP
 ├── Industry
 ├── Job title
 ├── Pain points
 ├── Goals
 ├── Objections
 └── Buying triggers

MARKET
 ├── Competitors
 ├── Alternatives
 ├── Market positioning
 └── Category language
```

AI không nên mỗi lần generate lại đọc prompt từ đầu.

Nó phải có **persistent project context**.

---

# 4. Engine 2 — Marketing Strategy

Đây là điểm giúp sản phẩm khác biệt với Framer AI / Lovable / các AI website builder thông thường.

AI phải quyết định:

### Positioning

Ví dụ:

> “The easiest order management platform for Vietnamese online sellers.”

### Value proposition

```text
For [target audience]

Who struggle with [problem]

Our product provides [solution]

Unlike [alternative]

Because [differentiator].
```

### Messaging hierarchy

```text
Core Message
      ↓
Primary Value Proposition
      ↓
3–5 Supporting Benefits
      ↓
Features
      ↓
Proof
      ↓
Objection handling
      ↓
CTA
```

Điều này cực kỳ quan trọng.

Một landing page đẹp nhưng **messaging sai** vẫn conversion thấp.

---

# 5. Engine 3 — Landing Page Architecture

AI phải biết **khi nào nên dùng section nào**.

Không nên hard-code:

```text
Hero
Features
Testimonials
Pricing
FAQ
Footer
```

cho mọi website.

Thay vào đó có:

### Section Library

Ví dụ:

**Hero**

- Hero A — SaaS
- Hero B — Product-led
- Hero C — Lead generation
- Hero D — Ecommerce
- Hero E — Personal brand
- Hero F — AI product

**Social Proof**

- Logo wall
- Review cards
- Metric proof
- Customer quote
- Case study

**Features**

- Bento
- Feature split
- Feature tabs
- Screenshot + copy
- Workflow

**CTA**

- CTA banner
- CTA card
- Form CTA
- Demo CTA
- Calendar CTA

AI chọn component dựa trên:

```text
business type
+
traffic intent
+
conversion goal
+
stage of funnel
+
brand personality
```

---

# 6. Engine 4 — Copywriting Intelligence

Đây nên là một hệ thống riêng.

Không đơn giản:

> “Write landing page copy.”

Mà phải có framework.

Ví dụ:

### Hero

```text
Eyebrow
↓
Headline
↓
Subheadline
↓
Primary CTA
↓
Secondary CTA
↓
Trust signal
```

AI đánh giá headline theo:

- Clarity
- Specificity
- Relevance
- Benefit
- Differentiation
- Emotional impact
- Search intent

Ví dụ AI có thể tự đánh giá:

```text
Headline Score

Clarity       92
Specificity   84
Benefit       95
Differentiation 71
SEO relevance 88
CRO potential 91
```

Sau đó generate 5–10 variations.

---

# 7. Engine 5 — SEO Intelligence

Đừng biến SEO thành:

> meta title + meta description.

Bạn cần một **SEO Agent**.

Nó kiểm tra:

### Technical SEO

- title
- meta description
- canonical
- robots
- sitemap
- Open Graph
- Twitter cards
- structured data
- semantic HTML
- heading hierarchy
- image alt
- internal links

### On-page SEO

- search intent
- keyword relevance
- topical coverage
- entity coverage
- semantic relationships
- content depth
- information architecture

### Programmatic SEO

Nếu sau này bạn muốn scale:

```text
/product/order-management
/product/inventory
/product/shipping
/product/warehouse
```

AI có thể tạo page architecture cho hàng nghìn landing pages mà vẫn kiểm soát:

- duplicate content
- canonical
- template variation
- internal linking
- metadata

---

# 8. Engine 6 — UX/CRO Auditor

Đây là thứ tôi đặc biệt khuyên bạn làm.

Sau khi AI tạo page:

**AI phải tự phê bình chính sản phẩm của mình.**

Ví dụ:

```text
CRO AUDIT

❌ Hero CTA lacks specificity
⚠️ Too many competing CTAs
❌ No social proof above fold
⚠️ Pricing appears too early
❌ Main objection not addressed
⚠️ Form asks for 7 fields
```

Sau đó:

> “Fix automatically”

AI sửa page.

---

# 9. Xây một Landing Page Scoring System

Đây có thể trở thành core IP của sản phẩm.

Ví dụ:

```text
LANDING PAGE SCORE
────────────────────────

Messaging       91/100
Copy            88/100
UX              94/100
UI              92/100
CRO             87/100
SEO             95/100
Accessibility   96/100
Performance     89/100
Mobile UX       93/100
Trust           81/100

────────────────────────
TOTAL            90.6/100
```

Nhưng quan trọng hơn:

**Score phải giải thích được tại sao.**

---

# 10. UI Builder không nên chỉ là Figma clone

Đây là một quyết định product rất quan trọng.

Đừng cố làm:

> Canva + Figma + Webflow + AI

ngay từ đầu.

Bạn nên làm:

### AI-first builder

Bên trái:

```text
AI COMMAND

"Make hero more premium"
"Target enterprise customers"
"Make this section shorter"
"Add social proof"
"Improve SEO"
"Make CTA stronger"
"Use Donve brand"
```

Center:

```text
LIVE WEBSITE
```

Bên phải:

```text
PAGE
├── Hero
├── Social proof
├── Problem
├── Solution
├── Features
├── How it works
├── Testimonials
├── Pricing
├── FAQ
└── CTA
```

AI hiểu **semantic tree** chứ không chỉ hiểu pixels.

---

# 11. Page nên có một JSON/AST riêng

Đây là kiến trúc kỹ thuật tôi rất khuyến nghị.

Không để AI generate HTML trực tiếp.

Ví dụ:

```json
{
  "page": {
    "type": "saas_landing",
    "goal": "demo_signup"
  },
  "sections": [
    {
      "type": "hero",
      "variant": "saas_07",
      "content": {
        "headline": "...",
        "subheadline": "...",
        "cta": "..."
      }
    },
    {
      "type": "social_proof",
      "variant": "logos_02"
    }
  ]
}
```

Sau đó:

```text
AI
 ↓
Page Schema
 ↓
Renderer
 ↓
React / HTML
```

Lợi ích cực lớn:

- AI dễ edit
- Undo/redo
- versioning
- A/B testing
- responsive
- theme switching
- component replacement
- SEO validation
- analytics
- export code

---

# 12. Design System Engine

Bạn nên có:

```text
Brand
├── Logo
├── Colors
├── Typography
├── Spacing
├── Radius
├── Shadows
├── Buttons
├── Cards
└── Icons
```

AI sẽ generate **design tokens**:

```text
primary
secondary
background
foreground
muted
border

font-heading
font-body

radius-sm
radius-md
radius-lg

spacing-xs
spacing-sm
spacing-md
...
```

Sau đó toàn bộ landing page sử dụng token.

Khi user nói:

> “Make it more premium.”

AI không sửa 47 component.

Nó có thể điều chỉnh:

```text
Typography
Spacing
Radius
Contrast
Density
Animation
```

---

# 13. Responsive phải là một AI system riêng

Đừng để AI generate desktop rồi:

> “mobile: stack everything”

Không đủ tốt.

AI cần hiểu:

```text
Desktop
1440px
↓
Tablet
1024px
↓
Mobile
768px
↓
Mobile
390px
```

Và quyết định:

- hide
- reorder
- resize
- stack
- change typography
- change image crop
- change CTA
- change navigation

---

# 14. Image Intelligence

Đây cũng là một phần rất quan trọng.

AI phải biết:

> Landing page này cần hình gì?

Ví dụ:

```text
Hero
→ product screenshot

Feature 1
→ dashboard screenshot

Feature 2
→ workflow illustration

Trust
→ customer logos

Case study
→ customer photo
```

Và có thể:

- generate image
- resize
- crop
- background removal
- optimize WebP/AVIF
- generate alt text
- responsive images

---

# 15. Performance Engine

Mục tiêu không phải chỉ:

> đẹp.

Mà:

> đẹp + nhanh.

AI nên audit:

```text
LCP
CLS
INP
TTFB
JS size
CSS size
Image size
Font loading
Third-party scripts
```

và tự đề xuất:

> Hero image is 2.8MB → compress to ~250KB.

> 4 font weights are loaded → reduce to 2.

> Animation blocks rendering → defer.

---

# 16. Accessibility phải built-in

AI audit:

- WCAG
- contrast
- keyboard navigation
- focus states
- semantic HTML
- aria labels
- alt text
- heading structure
- form labels
- reduced motion

Đừng để accessibility là feature phụ.

Nó nên nằm trong **generation pipeline**.

---

# 17. Marketing Analytics

Sau khi publish:

```text
Visitors
↓
Hero engagement
↓
Scroll depth
↓
CTA clicks
↓
Form start
↓
Form completion
↓
Conversion
```

AI có thể nói:

> 73% users leave before reaching the pricing section.

hoặc:

> Mobile CTA conversion is 41% lower than desktop.

Sau đó:

> “Generate optimization.”

AI tạo variation.

---

# 18. A/B Testing Agent

Đây mới là thứ biến builder thành platform.

Ví dụ:

```text
Variant A
"Manage all your orders in one place."

Variant B
"Stop losing orders across Shopee, TikTok & Facebook."

Variant C
"One dashboard for every order you receive."
```

AI theo dõi:

```text
CTR
CVR
Lead quality
Revenue
```

Sau đó xác định winner.

---

# 19. Bạn nên xây một Knowledge Base cực lớn

Đây là phần **AI moat**.

Knowledge base nên chứa:

### Marketing

- positioning
- segmentation
- JTBD
- AIDA
- PAS
- BAB
- 4Ps
- customer journey
- funnel
- offer design

### Copywriting

- headlines
- CTAs
- objection handling
- benefit writing
- proof
- storytelling

### CRO

- landing page patterns
- form optimization
- trust
- pricing psychology
- friction
- cognitive load

### UX

- hierarchy
- Gestalt
- interaction design
- mobile patterns
- navigation
- accessibility

### SEO

- technical SEO
- semantic SEO
- topical authority
- schema
- search intent
- internal linking

### UI

- typography
- grids
- spacing
- color
- composition
- responsive design
- design systems

---

# 20. Nhưng đừng chỉ đưa Knowledge Base vào prompt

Đây là lỗi phổ biến.

Bạn cần biến kiến thức thành **rules + evaluators**.

Ví dụ:

```text
RULE:

Hero must communicate:
1. What
2. Who
3. Why

within the first viewport.
```

Evaluator:

```text
Does the hero clearly communicate
what the product does?

score = 0–10
```

Sau đó:

```text
if score < 8:
    regenerate
```

Đây gọi là **AI evaluation loop**.

---

# 21. Pipeline tốt nhất sẽ là

Tôi sẽ thiết kế generation như sau:

```text
USER
 ↓
DISCOVERY
 ↓
BUSINESS UNDERSTANDING
 ↓
CUSTOMER RESEARCH
 ↓
MARKET RESEARCH
 ↓
POSITIONING
 ↓
MESSAGING
 ↓
CONTENT STRATEGY
 ↓
PAGE ARCHITECTURE
 ↓
DESIGN SYSTEM
 ↓
UI GENERATION
 ↓
COPY GENERATION
 ↓
SEO GENERATION
 ↓
CODE GENERATION
 ↓
SELF-AUDIT
 ↓
CRO AUDIT
 ↓
SEO AUDIT
 ↓
UX AUDIT
 ↓
PERFORMANCE AUDIT
 ↓
AUTO FIX
 ↓
FINAL PAGE
```

**Không nên:**

```text
Prompt → LLM → HTML
```

---

# 22. Tôi sẽ chia product thành 4 phase

## Phase 1 — AI Landing Page Generator

MVP:

```text
Input business
       ↓
AI strategy
       ↓
AI copy
       ↓
AI page architecture
       ↓
AI design
       ↓
Live landing page
```

Chỉ cần khoảng **20–30 section components chất lượng cực cao**.

Không cần 500 components.

---

## Phase 2 — AI Landing Page Builder

Thêm:

- visual editor
- drag/drop
- AI edit
- design system
- responsive
- custom domain
- SEO
- analytics
- export

---

## Phase 3 — AI Optimization

Thêm:

- CRO audit
- SEO audit
- performance audit
- A/B testing
- conversion analytics
- AI recommendations

---

## Phase 4 — AI Marketing Platform

Sau cùng mới mở rộng:

```text
Landing Page
+
Blog
+
SEO
+
Ads landing pages
+
Lead capture
+
CRM
+
Analytics
+
A/B testing
+
Personalization
```

Lúc đó sản phẩm không còn là:

> AI website builder

mà là:

> **AI conversion platform.**

---

# 23. Nếu tôi xây sản phẩm này, tôi sẽ đặc biệt chú trọng 5 thứ

### ① Quality of generated pages

Không cần 100 template.

**20 template nhưng cực đẹp và cực đúng conversion logic** tốt hơn.

### ② AI reasoning layer

AI phải biết **tại sao** nó chọn section đó.

### ③ Evaluation

AI phải có khả năng:

> generate → critique → improve → validate.

### ④ Design system

Để page không trở thành “AI slop”.

### ⑤ Data feedback loop

Website càng có traffic → AI càng học được:

```text
industry
→ audience
→ layout
→ copy
→ CTA
→ conversion
```

Đây mới là lợi thế cạnh tranh dài hạn.

---

# 24. Một điểm rất quan trọng: đừng xây AI builder trước

Nếu bạn thực sự muốn làm sản phẩm này, tôi khuyên thứ tự ngược lại:

### Bước 1

Xây **Landing Page Intelligence Engine**.

### Bước 2

Xây **Page Schema**.

### Bước 3

Xây **Component/Design System**.

### Bước 4

Xây **Renderer**.

### Bước 5

Xây **Visual Builder**.

### Bước 6

Xây **AI Optimizer**.

Bởi vì nếu bạn làm editor trước, rất dễ rơi vào việc mất hàng tháng xây:

> drag / drop / resize / padding / margin / responsive / layers...

nhưng cuối cùng AI vẫn tạo ra landing page trung bình.

---

# 25. Kiến trúc sản phẩm tôi đề xuất

Ở mức high-level:

```text
                    FRONTEND
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    AI Chat       Visual Editor    Preview
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                PAGE ORCHESTRATOR
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Strategy AI     Content AI      Design AI
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                  PAGE AST / JSON
                       ↓
                COMPONENT ENGINE
                       ↓
                  RENDER ENGINE
                       ↓
                HTML / React / CSS
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      SEO          Performance       UX/CRO
       AI              AI              AI
        └──────────────┼──────────────┘
                       ↓
                  AUTO-FIX LOOP
                       ↓
                    PUBLISH
                       ↓
                  ANALYTICS
                       ↓
                 OPTIMIZATION AI
```

---

# 26. Và nếu bạn muốn làm thật, tôi nghĩ bước tiếp theo nên là **Product Blueprint**

Thay vì tiếp tục nói chung chung, chúng ta có thể thiết kế nó thành một sản phẩm thật.

Tôi có thể giúp bạn xây tiếp theo thứ tự:

1. **Product Vision**
2. **Target customer / ICP**
3. **Feature map**
4. **AI Agent architecture**
5. **Landing Page knowledge architecture**
6. **Prompt architecture**
7. **Page JSON schema**
8. **Component schema**
9. **Design system**
10. **AI scoring system**
11. **SEO engine**
12. **CRO engine**
13. **UX/UI engine**
14. **AI self-critique loop**
15. **Database architecture**
16. **Tech stack**
17. **MVP scope**
18. **Roadmap V1 → V2 → V3**
19. **UI/UX của chính platform**
20. **Cách để AI generate landing page đạt chất lượng production**

Đặc biệt, nếu đây là dự án bạn thực sự định build, tôi khuyên **đừng bắt đầu bằng việc viết code**. Hãy đầu tiên làm một **“Landing Page Quality Specification”** — một bộ tiêu chuẩn khoảng 100–200 rules/evaluators mà mọi landing page do AI tạo ra đều phải vượt qua.

Đó sẽ là “bộ não” của sản phẩm; builder chỉ là lớp giao diện bên ngoài.
