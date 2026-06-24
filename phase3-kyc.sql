-- ============================================================
--  NyumbaVerified — Phase 3 KYC setup
--  Safe to run more than once. Paste into Supabase > SQL Editor > Run.
-- ============================================================

-- 1) Columns on profiles to hold the submitted ID details
alter table profiles add column if not exists id_photo_path   text;
alter table profiles add column if not exists id_number       text;
alter table profiles add column if not exists id_full_name    text;
alter table profiles add column if not exists id_dob          text;
alter table profiles add column if not exists kyc_submitted_at timestamptz;

-- kyc_status now flows: pending -> submitted -> verified | rejected
-- (no change needed; it is a text column)

-- 2) Private storage bucket for ID photos
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

-- 3) Storage access policies
--    Files are stored at  {user_id}/id-xxx.jpg

-- Users can upload into their own folder
drop policy if exists "kyc upload own" on storage.objects;
create policy "kyc upload own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can read their own files
drop policy if exists "kyc read own" on storage.objects;
create policy "kyc read own"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read everyone's files (for review + signed URLs)
drop policy if exists "kyc admin read" on storage.objects;
create policy "kyc admin read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'kyc-documents'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
