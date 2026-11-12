CREATE POLICY "Allow admins to manage bins"
ON public.bins
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());