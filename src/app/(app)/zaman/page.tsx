import { ComingSoon } from "@/components/ui/ComingSoon";
import { PieChart } from "lucide-react";

export default function ZamanPage() {
  return (
    <ComingSoon
      title="Zaman Dağılımı"
      description="Pasta grafik ile web sitesi kullanım sürelerinin görsel dağılımı. 'X gün Y sa Z dk' formatında detaylı analiz."
      icon={PieChart}
      accent="#7209B7"
    />
  );
}
