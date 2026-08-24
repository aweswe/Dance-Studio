/**
 * Database type definitions for Supabase.
 *
 * GENERATED from the live database (project pndbazmwnbqzkwwmmgaf). Regenerate with:
 *   supabase gen types typescript --db-url "postgresql://postgres.pndbazmwnbqzkwwmmgaf:<password>@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" --schema public > src/lib/supabase/types.ts
 * then re-append the convenience aliases at the bottom of this file.
 *
 * The generated `Relationships` metadata is required by postgrest-js 2.x —
 * without it, awaited query results collapse to `never`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          batch_id: string | null
          created_at: string | null
          date: string
          id: string
          marked_by: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          marked_by?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          capacity: number
          created_at: string | null
          days: string[] | null
          enrolled_count: number | null
          id: string
          instructor_id: string | null
          name: string | null
          programme_id: string | null
          status: Database["public"]["Enums"]["batch_status"] | null
          time_end: string | null
          time_start: string | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          days?: string[] | null
          enrolled_count?: number | null
          id?: string
          instructor_id?: string | null
          name?: string | null
          programme_id?: string | null
          status?: Database["public"]["Enums"]["batch_status"] | null
          time_end?: string | null
          time_start?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          days?: string[] | null
          enrolled_count?: number | null
          id?: string
          instructor_id?: string | null
          name?: string | null
          programme_id?: string | null
          status?: Database["public"]["Enums"]["batch_status"] | null
          time_end?: string | null
          time_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_logs: {
        Row: {
          id: string
          message: string
          recipient_count: number | null
          recipients: Json | null
          sent_at: string | null
          sent_by: string | null
          template_name: string | null
        }
        Insert: {
          id?: string
          message: string
          recipient_count?: number | null
          recipients?: Json | null
          sent_at?: string | null
          sent_by?: string | null
          template_name?: string | null
        }
        Update: {
          id?: string
          message?: string
          recipient_count?: number | null
          recipients?: Json | null
          sent_at?: string | null
          sent_by?: string | null
          template_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_logs_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          paid_at: string | null
          payment_order_id: string | null
          razorpay_payment_id: string | null
          receipt_url: string | null
          source: Database["public"]["Enums"]["payment_source"]
          student_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_order_id?: string | null
          razorpay_payment_id?: string | null
          receipt_url?: string | null
          source: Database["public"]["Enums"]["payment_source"]
          student_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_order_id?: string | null
          razorpay_payment_id?: string | null
          receipt_url?: string | null
          source?: Database["public"]["Enums"]["payment_source"]
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_payment_order_id_fkey"
            columns: ["payment_order_id"]
            isOneToOne: false
            referencedRelation: "payment_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          created_at: string | null
          id: string
          is_visible: boolean | null
          programme_id: string | null
          sort_order: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          type: Database["public"]["Enums"]["gallery_type"]
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          programme_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          type: Database["public"]["Enums"]["gallery_type"]
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          programme_id?: string | null
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["gallery_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors: {
        Row: {
          auth_id: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kuchipudi_progress: {
        Row: {
          certificate_urls: Json | null
          current_level: string | null
          id: string
          modules_completed: Json | null
          student_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          certificate_urls?: Json | null
          current_level?: string | null
          id?: string
          modules_completed?: Json | null
          student_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          certificate_urls?: Json | null
          current_level?: string | null
          id?: string
          modules_completed?: Json | null
          student_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kuchipudi_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kuchipudi_progress_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_orders: {
        Row: {
          amount: number
          batch_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          programme_id: string | null
          razorpay_order_id: string | null
          status: string | null
          student_email: string | null
          student_id: string | null
          student_name: string | null
          student_phone: string | null
          updated_at: string | null
          webhook_payload: Json | null
        }
        Insert: {
          amount: number
          batch_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          programme_id?: string | null
          razorpay_order_id?: string | null
          status?: string | null
          student_email?: string | null
          student_id?: string | null
          student_name?: string | null
          student_phone?: string | null
          updated_at?: string | null
          webhook_payload?: Json | null
        }
        Update: {
          amount?: number
          batch_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          programme_id?: string | null
          razorpay_order_id?: string | null
          status?: string | null
          student_email?: string | null
          student_id?: string | null
          student_name?: string | null
          student_phone?: string | null
          updated_at?: string | null
          webhook_payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      programmes: {
        Row: {
          age_group: string | null
          created_at: string | null
          description: string | null
          fees_monthly: number | null
          fees_quarterly: number | null
          id: string
          includes: string[] | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          age_group?: string | null
          created_at?: string | null
          description?: string | null
          fees_monthly?: number | null
          fees_quarterly?: number | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          age_group?: string | null
          created_at?: string | null
          description?: string | null
          fees_monthly?: number | null
          fees_quarterly?: number | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          content_value: Json | null
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content_key: string
          content_value?: Json | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content_key?: string
          content_value?: Json | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          auth_id: string | null
          batch_id: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          join_date: string | null
          name: string
          phone: string | null
          profile_photo_url: string | null
          programme_id: string | null
          status: string | null
          student_id_display: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          batch_id?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          name: string
          phone?: string | null
          profile_photo_url?: string | null
          programme_id?: string | null
          status?: string | null
          student_id_display?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          batch_id?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          programme_id?: string | null
          status?: string | null
          student_id_display?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      studio_rentals: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          preferred_date: string
          preferred_time_end: string
          preferred_time_start: string
          status: Database["public"]["Enums"]["rental_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          preferred_date: string
          preferred_time_end: string
          preferred_time_start: string
          status?: Database["public"]["Enums"]["rental_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          preferred_date?: string
          preferred_time_end?: string
          preferred_time_start?: string
          status?: Database["public"]["Enums"]["rental_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_consecutive_absences: {
        Args: { p_student_id: string; p_threshold: number }
        Returns: boolean
      }
      decrement_batch_enrollment: {
        Args: { p_batch_id: string }
        Returns: boolean
      }
      get_dashboard_analytics: { Args: never; Returns: Json }
      get_student_attendance_summary: {
        Args: { p_student_id: string }
        Returns: Json
      }
      get_user_role: { Args: never; Returns: string }
      increment_batch_enrollment: {
        Args: { p_batch_id: string }
        Returns: boolean
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "leave"
      batch_status: "active" | "paused" | "full"
      gallery_type: "photo" | "video"
      payment_source: "razorpay" | "cash" | "upi_offline"
      rental_status: "pending" | "confirmed" | "cancelled"
      user_role: "admin" | "instructor" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["present", "absent", "leave"],
      batch_status: ["active", "paused", "full"],
      gallery_type: ["photo", "video"],
      payment_source: ["razorpay", "cash", "upi_offline"],
      rental_status: ["pending", "confirmed", "cancelled"],
      user_role: ["admin", "instructor", "student"],
    },
  },
} as const


// Convenience aliases (not part of the generated output)
export type UserRole = Database["public"]["Enums"]["user_role"];
export type AttendanceStatus = Database["public"]["Enums"]["attendance_status"];
export type PaymentSource = Database["public"]["Enums"]["payment_source"];
export type BatchStatus = Database["public"]["Enums"]["batch_status"];
export type RentalStatus = Database["public"]["Enums"]["rental_status"];
export type GalleryType = Database["public"]["Enums"]["gallery_type"];
