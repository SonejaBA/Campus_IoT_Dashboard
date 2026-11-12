CREATE POLICY "Allow admins to read telemetry logs"
ON public.telemetry_logs
FOR SELECT
TO authenticated
USING (public.is_admin());