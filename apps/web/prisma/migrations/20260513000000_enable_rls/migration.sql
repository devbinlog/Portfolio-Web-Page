-- Enable Row-Level Security on all tables
-- Prisma connects as the postgres superuser which bypasses RLS, so this
-- does not affect the application. It blocks direct REST API access via
-- Supabase's anon/authenticated roles.

ALTER TABLE "admin_users"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "social_links"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_media"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_links"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tags"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_tags"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assets"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs"       ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────────────────────
-- PUBLIC READ-ONLY tables (portfolio content)
-- Anyone (anon) may SELECT; no one may INSERT/UPDATE/DELETE via REST.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_select_profiles"
  ON "profiles" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_social_links"
  ON "social_links" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_categories"
  ON "categories" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_projects"
  ON "projects" FOR SELECT TO anon
  USING ("isPublished" = true AND "deletedAt" IS NULL);

CREATE POLICY "public_select_project_media"
  ON "project_media" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_project_documents"
  ON "project_documents" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_project_links"
  ON "project_links" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_tags"
  ON "tags" FOR SELECT TO anon USING (true);

CREATE POLICY "public_select_project_tags"
  ON "project_tags" FOR SELECT TO anon USING (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- contact_messages: visitors may INSERT only; no one reads via REST.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE POLICY "public_insert_contact_messages"
  ON "contact_messages" FOR INSERT TO anon WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- Sensitive tables — no access via REST for anon or authenticated roles.
-- admin_users, audit_logs, assets: no policies → default-deny.
-- ──────────────────────────────────────────────────────────────────────────────
