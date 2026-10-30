from overserviced import find_clearings

def readings(*levels):
    return [{"fill_level": level, "time": f"t{i}"} for i, level in enumerate(levels)]

# 59 -> 55 is trash settling, not a pickup
assert find_clearings(readings(59, 55)) == []
# 40 -> 5 is a pickup of a bin that was only 40% full
assert len(find_clearings(readings(40, 5))) == 1
# a pickup from an already-full bin is normal, so it is not counted
assert find_clearings(readings(85, 3)) == []
# a drop that lands at 25 still counts (extra trash arrived before the next ping)
assert len(find_clearings(readings(45, 25))) == 1
# exactly 50 is not "under 50"
assert find_clearings(readings(50, 5)) == []
# rising readings are ignored; only the two real drops count
assert len(find_clearings(readings(30, 5, 28, 3))) == 2

print("all tests passed")