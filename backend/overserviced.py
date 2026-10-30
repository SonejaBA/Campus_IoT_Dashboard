def find_clearings(readings, min_drop=20, max_fill_before=50):
    """
    readings: ONE bin's readings, oldest first. Each is a dict with "fill_level" and "time".
    Returns the "clearing" events: a drop of at least min_drop points
    that started from a fill level below max_fill_before.
    """
    events = []
    for before, after in zip(readings, readings[1:]):
        if before["fill_level"] is None or after["fill_level"] is None:
            continue

        drop = before["fill_level"] - after["fill_level"]
        if drop >= min_drop and before["fill_level"] < max_fill_before:
            events.append({
                "time": after["time"],
                "before": before["fill_level"],
                "after": after["fill_level"],
            })
    return events