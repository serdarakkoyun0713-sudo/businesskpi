import { ComingSoon } from "@/components/ui/ComingSoon";
import { CalendarDays } from "lucide-react";

export default function GirisYapPage() {
  return (
    <ComingSoon
      title="Günlük Veri Girişi"
      description="Manuel form ve CSV yükleme (Web Activity Tracker desteği) ile günlük Etsy + kişisel verilerini girebileceğin sayfa."
      icon={CalendarDays}
      accent="#4361EE"
    />
  );
}
