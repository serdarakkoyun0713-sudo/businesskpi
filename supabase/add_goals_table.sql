-- ============================================================
-- BusinessKPI — Hedefler tablosu
-- Supabase SQL Editor'da çalıştır (schema.sql'den sonra)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_goals (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Aylık Etsy hedefleri
  siparis_hedef    INT     DEFAULT 100,
  listing_hedef    INT     DEFAULT 50,
  ciro_hedef       NUMERIC DEFAULT 500,

  -- Aylık kişisel gelişim (dakika / sayfa)
  egzersiz_hedef   INT     DEFAULT 600,    -- aylık toplam dakika
  ingilizce_hedef  INT     DEFAULT 600,
  okuma_hedef      INT     DEFAULT 30,     -- sayfa

  -- Uyku hedefi (saat, noktalı)
  uyku_hedef       NUMERIC DEFAULT 7.5,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanici kendi hedeflerini gorebilir"
  ON public.user_goals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi hedeflerini ekleyebilir"
  ON public.user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi hedeflerini guncelleyebilir"
  ON public.user_goals FOR UPDATE USING (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER set_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
