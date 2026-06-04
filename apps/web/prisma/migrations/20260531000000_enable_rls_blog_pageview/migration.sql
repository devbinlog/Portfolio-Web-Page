-- Enable RLS on tables added in 20260516104924_add_blog_and_pageview
-- These were missing from the earlier enable_rls migration (20260513000000).

ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "page_views" ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────────────────────
-- blog_posts: anon may SELECT published posts only; no INSERT/UPDATE/DELETE.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_select_blog_posts"
  ON "blog_posts" FOR SELECT TO anon
  USING ("isPublished" = true);

-- ──────────────────────────────────────────────────────────────────────────────
-- page_views: no REST access for any role.
-- All reads/writes go through server-side Prisma (postgres user bypasses RLS).
-- No policies = default-deny.
-- ──────────────────────────────────────────────────────────────────────────────

-- ──────────────────────────────────────────────────────────────────────────────
-- Explicit GRANTs — required for PostgREST to evaluate RLS policies.
-- Starting Oct 30 2026, Supabase will no longer auto-grant public schema tables
-- to anon/authenticated roles on existing projects. Adding these now prevents
-- breakage when that deadline hits.
-- ──────────────────────────────────────────────────────────────────────────────

GRANT SELECT ON "blog_posts" TO anon, authenticated;
-- page_views intentionally withheld from anon/authenticated (server-side only)

-- Backfill GRANTs for tables that already have RLS policies from the earlier
-- migration (20260513000000_enable_rls) to be explicit ahead of the Oct 30 cutoff.

GRANT SELECT ON "profiles"          TO anon, authenticated;
GRANT SELECT ON "social_links"      TO anon, authenticated;
GRANT SELECT ON "categories"        TO anon, authenticated;
GRANT SELECT ON "projects"          TO anon, authenticated;
GRANT SELECT ON "project_media"     TO anon, authenticated;
GRANT SELECT ON "project_documents" TO anon, authenticated;
GRANT SELECT ON "project_links"     TO anon, authenticated;
GRANT SELECT ON "tags"              TO anon, authenticated;
GRANT SELECT ON "project_tags"      TO anon, authenticated;
GRANT INSERT ON "contact_messages"  TO anon;
