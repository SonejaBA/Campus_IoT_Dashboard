CREATE POLICY "Allow authenticated users to read bins"
ON public.bins
FOR SELECT
TO authenticated
USING (true);
