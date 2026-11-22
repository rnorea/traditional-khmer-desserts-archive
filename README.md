# Khmer Desserts Archive (បណ្ណសារបង្អែមបុរាណខ្មែរ)

A living digital archive preservingtraditional Khmer confectionery, recipes, and culinary heritage across Cambodia.

---

## 1. What this is

The **Khmer Desserts Archive** is an open-access cultural repository dedicated to preserving traditional Cambodian confectionery (*បង្អែមខ្មែរ*). Sourced from oral knowledge and local elders. The archive records indigenous ingredients, methods, and regional histories at risk of being lost. Visitors can explore authentic recipes in Khmer and English; contributors can register to submit family recipes; and archive reviewers evaluate each submission before publication.

---

## 2. Who it's for

Built for everyday people in Cambodia: home cooks, youth, culinary students, and the diaspora.

* **Khmer first:** Khmer is primary content (`/[lang]` with `kh` and `en`). Strict validation blocks English in Khmer fields and enforces authentic Khmer script without transliteration.
* **Phones first:** Responsive for 375px+ screens with 44px+ touch targets, mobile drawer navigation, and clean modal viewers.
* **Slow connections:** Zero external UI libraries or heavy CSS bundles. Direct Supabase queries, lightweight WebP/JPEG images, and client-side pagination keep network payloads light on cellular 3G/4G.
* **Attribution:** Every recipe explicitly credits the contributing elder and home province in both languages.

---

## 3. How it works

**Stack:** Next.js 15 (App Router, React 19) hosted on Vercel; Supabase (PostgreSQL, Auth, Storage) for the backend.

### Tables & Roles
* **`public.profiles`**: Extends `auth.users` with `username`, `full_name`, `organization`, and `role` (`'user'` or `'admin'`). Populated automatically on signup by trigger `on_auth_user_created`.
* **`public.entries`**: Stores dessert records with bilingual fields (`title`, `description`, `ingredients`, `instructions`), `category`, `region`, `source`, `image_url`, `status`, and `author_id`.
* **Reviewers**: Verified via database RPC `is_reviewer()` (evaluates `role = 'admin'` on `profiles`).

### Entry Statuses
1. **`pending`**: Newly submitted or edited. Visible only to author and reviewers.
2. **`published`**: Approved. Publicly visible to all visitors.
3. **`returned`**: Sent back for corrections. Visible only to author and reviewers.

### Row Level Security (RLS)
* **`entries` SELECT**: Public sees only `status = 'published'`. Authors see their own entries (`auth.uid() = author_id`). Admins see all.
* **`entries` INSERT**: Authenticated users can insert entries where `auth.uid() = author_id`.
* **`entries` UPDATE / DELETE**: Authors can edit/delete only their own entries (`auth.uid() = author_id`). Admins can edit/delete all. *(Author edits automatically reset status to `'pending'`)*.
* **`profiles`**: Publicly readable. Users can insert/update only their own record (`auth.uid() = id`).

---

## 4. Security decisions

* **The gate (`review_entry`):** State transitions (`pending` → `published` / `returned`) run via a database RPC function (`security definer`) that explicitly verifies reviewer authorization before updating the row.
* **Why database-level:** Hiding a "Publish" button in the UI protects nothing. Any user could open the browser console and run `supabase.from('entries').update({ status: 'published' })`. RLS policies block direct status escalation; only `review_entry` can publish.
* **Concurrency:** `ReviewList.js` validates that an entry is still `pending` before invoking RPC, disables buttons during transit, and syncs open tabs using `BroadcastChannel` (`khmer_archive_review_sync`) to evict processed cards instantly.
* **Returned entry messaging:** Returned entries display a red badge ("Returned" / "បានបញ្ជូនត្រឡប់") with an "Edit Entry" button in "My Archive" and the detail page, explaining: *"This entry is not yet published to the public. Only you and reviewers can see it."*
* **Taking down published entries:** Reviewers cannot take down published entries. They only process pending queue submissions. Deleting or editing published entries is reserved for the author and admins.
* **Search privacy:** Public search (`/archive`) enforces `.eq('status', 'published')` at query time. Contributors never see pending/returned drafts in public search; they track them privately in **My Archive** (`/my-archive`).

---

## 5. AI use

AI tools assisted as pair-programmers with human review on every diff. Following the principle of "always keep a human in the loop," outputs were treated as suggestions rather than authoritative solutions, and every change was tested and verified.

| Model / Tool | Task Assigned | Human Verdict & Action Taken |
| :--- | :--- | :--- |
| **Claude Sonnet** (Antigravity) | • Homepage & Archive layout planning (hero purpose section, card/list view toggle)<br>• `EntryCard` visual component styling<br>• Partial search fallback logic & discussion<br>• Profile page UI/UX redesign<br>• RLS database security patch verification (attack testing) | • **Layout & Components:** Adopted high-level layout ideas; discarded initial raw generated code due to simplistic styling and broken components, then iterated with specific constraints. Vague `EntryCard` prompt produced a plain, unfitting card, while a second prompt specifying layout hierarchy and confectionery color themes was kept.<br>• **Search & Profile:** Refined search fallback behavior with minor tweaks. Redesigned profile page layout and visual hierarchy to replace an unpolished initial version.<br>• **Security:** Collaborated with Gemini to resolve 3 failed RLS penetration test attacks, verifying fixes with direct test attacks. |
| **Gemini 3.1 Pro** (Antigravity) | • Bilingual language toggle (URL path prefix) & dessert name translations<br>• Hide-on-scroll navigation bar<br>• Mobile responsiveness, burger menu, "not found" card, & search reset button<br>• Supabase auth (login, signup, profile) & SQL/PostgreSQL explanations<br>• Entry CRUD implementation & initial RLS policies | • **Navigation & Language:** Kept hide-on-scroll navbar as generated; language toggle worked cleanly with minor manual adjustments to translated Khmer dessert names.<br>• **Mobile & Search:** "Not found" card and reset button accepted after small tweaks; burger menu overflowed and had poor text alignment, requiring heavy manual restructuring.<br>• **Auth & CRUD:** Functional auth and database connections kept; profile visual design was discarded for redesign. Fixed an issue where the model defaulted new entries to `'review'` instead of `'published'`, hiding them from view. |
| **Gemini 3.8 Flash** (Antigravity) | • Submit-review-publish lifecycle implementation (`pending` &rarr; `published` / `returned`)<br>• RLS policy penetration testing & attack remediation<br>• Review queue page implementation & status flow | • **Workflow & Logic:** Kept lifecycle transition logic; reviewers can approve or return submitted entries reliably.<br>• **Security:** Iterated through back-and-forth debugging after 3 of 5 simulated attacks bypassed RLS checks, successfully locking down reviewer escalation and unpublished row queries.<br>• **Review Queue UI:** Functional logic worked immediately, but initial UI was bland and inconsistent; required several rounds of prompt revisions for layout, button placement, and colors. |

**Verification:** Every change was reviewed against `AGENTS.md` (no external UI libraries, plain JS React 19, small components) and validated with manual penetration tests against Supabase RLS policies across visitor, contributor, and reviewer sessions.

---

## 6. Sources and credits

* **Primary Knowledge Bearer:**
  * **Om Sokha (អ៊ំ សុខា)**: Elder with a lot of traditional dessert making experiences, **Tbong Khmum Province (ខេត្តត្បូងឃ្មុំ)**. Contributed original recipes and methods for 10 core entries.
* **Media:** [Hero image](https://i.ytimg.com/vi/6DSelYdEj1U/maxresdefault.jpg), [Palm Sugar Sticky Rice Balls](https://kroya.restaurant/media/pages/glossary/nom-plai-ai/4889cff611-1709196094/nom-plai-eye-600x.jpg), [Pumpkin Custard](https://i.ytimg.com/vi/3l7_Bda4lDE/maxresdefault.jpg), [Sticky Rice Crisps with Coconut](https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQVHVyMXW3M6hwkJJTFiT1Ytm8y_8OHR-BVHS1Lu-Svl5CpKPln), [Taro and Sticky Rice Pudding](https://thumbs.dreamstime.com/b/bobor-trao-21093535.jpg), [Banana in Sweet Coconut Milk](https://grantourismotravels.com/wp-content/uploads/2021/09/Banana-Coconut-Tapioca-Pudding-Recipe-for-Cambodian-Chek-Ktis-Copyright-2022-Terence-Carter-Grantourismo-T-500x500.jpg), [Crispy Rice Flour Cake](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeQuv4tEQ3O0IFR21pd091uZrw8S4f1-XBTPhizAOMdlJdjSEzmhUQkzc&s=10), [Floating Tapioca Pearls](https://i.ytimg.com/vi/_c5bkxDOYLY/maxresdefault.jpg), [Fried Pounded Rice with Banana](https://i.ytimg.com/vi/KHEhLdRSn58/maxresdefault.jpg), [Taro Cake](https://i.ytimg.com/vi/iAaKwVqHLBA/maxresdefault.jpg), [Winter Melon (Wax Gourd) Cake](https://i.ytimg.com/vi/9ZxOq79wMPE/maxresdefault.jpg)


---

## 7. Running it locally

```bash
# Clone and install dependencies
git clone https://github.com/rnorea/traditional-khmer-desserts-archive.git
cd traditional-khmer-desserts-archive
npm install

# Configure environment variables in .env.local
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables
Set these variable names in `.env.local` (never commit keys):
* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

*Note: The publishable key is public by design; security is enforced by PostgreSQL RLS in the database.*

---

## 8. Submission checklist

## Submission checklist

- Live URL loads logged out and shows published entries only: yes, [URL](https://traditional-khmer-desserts-archive.vercel.app/en)
- A stranger cannot publish their own entry through the page or the console: yes, tested (22 November)
- Logged out, the API returns nothing pending or returned: yes, tested (22 November)
- Contributors can edit and delete only their own entries: yes
- No secrets anywhere in the repo history: yes, checked with git log -S and search
- At least eight real entries, each with a credited source: yes, (10 entries)
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, tested on (browser width ~440px)
- No test entries, lorem ipsum or TODO comments in shipped pages: yes
- No console errors on the main pages: yes
- jesseorndorff is a collaborator on this repo: yes
- Supabase project restored and awake on (22 November)
- Demo video link opens in a private window: yes, [URL](https://youtu.be/0LyfW-6L34s)
- Reflection pasted in the Canvas submission: yes
- Posted in the Show Your Archive discussion: yes
- Q&A slot booked for (1 December, 2:05-2:10)
