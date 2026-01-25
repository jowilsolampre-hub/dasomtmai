-- Create user_devices table to track connected devices
CREATE TABLE public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'unknown',
  platform TEXT,
  browser TEXT,
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- Users can only view their own devices
CREATE POLICY "Users can view their own devices"
  ON public.user_devices FOR SELECT
  USING (auth.uid() = user_id);

-- Users can register their own devices
CREATE POLICY "Users can register their own devices"
  ON public.user_devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own devices
CREATE POLICY "Users can update their own devices"
  ON public.user_devices FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can remove their own devices
CREATE POLICY "Users can delete their own devices"
  ON public.user_devices FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for devices table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_devices;

-- Create index for faster lookups
CREATE INDEX idx_user_devices_user_id ON public.user_devices(user_id);
CREATE INDEX idx_user_devices_last_active ON public.user_devices(last_active DESC);