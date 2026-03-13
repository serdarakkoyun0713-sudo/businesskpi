import { ComingSoon } from "@/components/ui/ComingSoon";
import { Target } from "lucide-react";

export default function HedeflerPage() {
  return (
    <ComingSoon
      title="Hedefler"
      description="Aylık sipariş, listing, ciro ve kişisel gelişim hedeflerini düzenleyebileceğin sayfa. Dashboard'daki ilerleme çubukları buradan beslenir."
      icon={Target}
      accent="#F59E0B"
    />
  );
}
