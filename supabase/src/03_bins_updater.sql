CREATE OR REPLACE FUNCTION update_bin_current_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.bins
  SET
    fill_level = COALESCE(
      GREATEST(NEW.compost, NEW.recycle, NEW.landfill),
      NEW.fill_level,
      0
    ),
    time = NEW.time,
    battery_level = NEW.battery_level,
    compost = COALESCE(NEW.compost, compost),
    recycle = COALESCE(NEW.recycle, recycle),
    landfill = COALESCE(NEW.landfill, landfill)
  WHERE id = NEW.bin_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER after_sensor_ping
AFTER INSERT ON public.telemetry_logs
FOR EACH ROW
EXECUTE FUNCTION update_bin_current_status();