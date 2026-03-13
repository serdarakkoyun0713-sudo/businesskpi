import { ComingSoon } from "@/components/ui/ComingSoon";
import { BarChart3 } from "lucide-react";

export default function OzetlerPage() {
  return (
    <ComingSoon
      title="Özetler"
      description="Yıllık kartlar ve aylık tablo formatında sipariş, ciro ve kişisel metriklerin özeti."
      icon={BarChart3}
      accent="#2DC653"
    />
  );
}
