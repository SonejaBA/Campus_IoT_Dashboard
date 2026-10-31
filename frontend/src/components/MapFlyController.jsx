import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";

export function MapFlyController({ bins }) {
  const map = useMap();
  const [searchParams] = useSearchParams();
  const targetBinId = searchParams.get("binId");

  useEffect(() => {
    if (!targetBinId || !bins || bins.length === 0) return;

    const targetBin = bins.find((b) => {
      const rawId = String(b.id);
      const paddedId = `BIN-${rawId.padStart(3, "0")}`;
      const search = String(targetBinId).toLowerCase();
      return (
        rawId === String(targetBinId) ||
        paddedId.toLowerCase() === search ||
        String(b.bin_id) === String(targetBinId)
      );
    });

    if (targetBin && targetBin.lat && (targetBin.long || targetBin.lng)) {
      const lat = Number(targetBin.lat);
      const lng = Number(targetBin.long ?? targetBin.lng);

      map.flyTo([lat, lng], 18, {
        animate: true,
        duration: 2,
      });

      setTimeout(() => {
        map.eachLayer((layer) => {
          if (layer.getLatLng && layer.getPopup) {
            const pos = layer.getLatLng();
            if (
              Math.abs(pos.lat - lat) < 0.0001 &&
              Math.abs(pos.lng - lng) < 0.0001
            ) {
              layer.openPopup();
            }
          }
        });
      }, 1200);
    }
  }, [targetBinId, bins, map]);

  return null;
}
