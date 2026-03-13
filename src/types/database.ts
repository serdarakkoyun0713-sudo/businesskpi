export type Database = {
  public: {
    Tables: {
      daily_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          siparis: number | null;
          listing: number | null;
          ciro: number | null;
          uyku: string | null;
          egzersiz_dk: number | null;
          ingilizce_dk: number | null;
          okuma_syf: number | null;
          yt_pc: number | null;
          yt_mob: number | null;
          ig_mob: number | null;
          gmail_pc: number | null;
          gmail_mob: number | null;
          wa_mob: number | null;
          wa_pc: number | null;
          kittl: number | null;
          canva: number | null;
          printify: number | null;
          etsy_seller: number | null;
          etsy_buyer: number | null;
          chatgpt: number | null;
          claude_ai: number | null;
          gemini: number | null;
          not_: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_entries"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["daily_entries"]["Insert"]>;
      };
      monthly_net: {
        Row: {
          id: string;
          user_id: string;
          yil: number;
          ay: number;
          net_usd: number;
          not_: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["monthly_net"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["monthly_net"]["Insert"]>;
      };
    };
  };
};

export type DailyEntry = Database["public"]["Tables"]["daily_entries"]["Row"];
export type MonthlyNet = Database["public"]["Tables"]["monthly_net"]["Row"];
