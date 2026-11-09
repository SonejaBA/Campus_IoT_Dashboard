CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (
    -- Block non-admins from changing their own role column
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    OR public.is_admin()
  )
);