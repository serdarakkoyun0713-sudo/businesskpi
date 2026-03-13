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
      user_goals: {
        Row: {
          id: string;
          user_id: string;
          siparis_hedef: number;
          listing_hedef: number;
          ciro_hedef: number;
          egzersiz_hedef: number;
          ingilizce_hedef: number;
          okuma_hedef: number;
          uyku_hedef: number;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_goals"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["user_goals"]["Insert"]>;
      };
    };
  };
};

export type DailyEntry  = Database["public"]["Tables"]["daily_entries"]["Row"];
export type MonthlyNet  = Database["public"]["Tables"]["monthly_net"]["Row"];
export type UserGoals   = Database["public"]["Tables"]["user_goals"]["Row"];

export const DEFAULT_GOALS: Omit<UserGoals, "id" | "user_id" | "updated_at"> = {
  siparis_hedef:   100,
  listing_hedef:    50,
  ciro_hedef:      500,
  egzersiz_hedef:  600,
  ingilizce_hedef: 600,
  okuma_hedef:      30,
  uyku_hedef:      7.5,
};
