create policy "Enable admin manual mark empty on bins via insert on telemetry_logs"
on "public"."telemetry_logs"
as PERMISSIVE
for INSERT
to authenticated
with check (
  public.is_admin()
); 