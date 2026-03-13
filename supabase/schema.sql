-- =============================================
-- BusinessKPI — Supabase Schema
-- Supabase SQL Editor'a kopyalayıp çalıştır
-- =============================================

-- 1. daily_entries tablosu
CREATE TABLE IF NOT EXISTS public.daily_entries (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date          DATE NOT NULL,

  -- Etsy iş metrikleri
  siparis       INT,
  listing       INT,
  ciro          NUMERIC(10, 2),

  -- Kişisel metrikler
  uyku          TEXT,         -- "6:30" formatı (saat:dakika)
  egzersiz_dk   INT,
  ingilizce_dk  INT,
  okuma_syf     INT,

  -- Web aktivitesi (dakika cinsinden)
  yt_pc         INT,          -- YouTube (PC)
  yt_mob        INT,          -- YouTube (Mobil)
  ig_mob        INT,          -- Instagram (Mobil)
  gmail_pc      INT,          -- Gmail / Google Docs (PC)
  gmail_mob     INT,          -- Gmail (Mobil)
  wa_mob        INT,          -- WhatsApp (Mobil)
  wa_pc         INT,          -- WhatsApp Web (PC)

  -- Tasarım & üretim araçları (dakika)
  kittl         INT,
  canva         INT,
  printify      INT,
  etsy_seller   INT,
  etsy_buyer    INT,

  -- AI araçları (dakika)
  chatgpt       INT,
  claude_ai     INT,
  gemini        INT,

  -- Not
  not_          TEXT,

  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Aynı kullanıcı için aynı tarihe tek kayıt
  UNIQUE(user_id, date)
);

-- 2. monthly_net tablosu
CREATE TABLE IF NOT EXISTS public.monthly_net (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  yil        INT NOT NULL,
  ay         INT NOT NULL CHECK (ay BETWEEN 1 AND 12),
  net_usd    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  not_       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, yil, ay)
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- daily_entries RLS
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanici kendi verilerini gorebilir"
  ON public.daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi verilerini ekleyebilir"
  ON public.daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi verilerini guncelleyebilir"
  ON public.daily_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi verilerini silebilir"
  ON public.daily_entries FOR DELETE
  USING (auth.uid() = user_id);

-- monthly_net RLS
ALTER TABLE public.monthly_net ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanici kendi net verilerini gorebilir"
  ON public.monthly_net FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi net verilerini ekleyebilir"
  ON public.monthly_net FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi net verilerini guncelleyebilir"
  ON public.monthly_net FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanici kendi net verilerini silebilir"
  ON public.monthly_net FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- updated_at otomatik güncelleme trigger
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- İndeksler (performans için)
-- =============================================

CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date
  ON public.daily_entries (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_monthly_net_user_yil_ay
  ON public.monthly_net (user_id, yil DESC, ay DESC);
