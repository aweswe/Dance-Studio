/**
 * Database type definitions for Supabase.
 * 
 * TODO: Generate these automatically with:
 *   npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts
 * 
 * For now, manually defined to match the migration schema.
 */

export type UserRole = "admin" | "instructor" | "student";
export type AttendanceStatus = "present" | "absent" | "leave";
export type PaymentSource = "razorpay" | "cash" | "upi_offline";
export type BatchStatus = "active" | "paused" | "full";
export type RentalStatus = "pending" | "confirmed" | "cancelled";
export type GalleryType = "photo" | "video";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          role?: UserRole;
        };
      };
      programmes: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          includes: string[] | null;
          fees_monthly: number | null;
          fees_quarterly: number | null;
          age_group: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          includes?: string[] | null;
          fees_monthly?: number | null;
          fees_quarterly?: number | null;
          age_group?: string | null;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["programmes"]["Insert"]>;
      };
      instructors: {
        Row: {
          id: string;
          auth_id: string | null;
          name: string;
          photo_url: string | null;
          bio: string | null;
          certifications: string[] | null;
          email: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          name: string;
          photo_url?: string | null;
          bio?: string | null;
          certifications?: string[] | null;
          email?: string | null;
          phone?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["instructors"]["Insert"]>;
      };
      batches: {
        Row: {
          id: string;
          programme_id: string;
          instructor_id: string | null;
          days: string[];
          time_start: string;
          time_end: string;
          capacity: number;
          enrolled_count: number;
          status: BatchStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          programme_id: string;
          instructor_id?: string | null;
          days: string[];
          time_start: string;
          time_end: string;
          capacity: number;
          enrolled_count?: number;
          status?: BatchStatus;
        };
        Update: Partial<Database["public"]["Tables"]["batches"]["Insert"]>;
      };
      students: {
        Row: {
          id: string;
          auth_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          programme_id: string | null;
          batch_id: string | null;
          student_id_display: string;
          status: string;
          join_date: string;
          profile_photo_url: string | null;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          programme_id?: string | null;
          batch_id?: string | null;
          student_id_display?: string;
          status?: string;
          join_date?: string;
          profile_photo_url?: string | null;
          display_name?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          batch_id: string;
          date: string;
          status: AttendanceStatus;
          marked_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          batch_id: string;
          date: string;
          status: AttendanceStatus;
          marked_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
      };
      fee_payments: {
        Row: {
          id: string;
          student_id: string | null;
          amount: number;
          source: PaymentSource;
          razorpay_payment_id: string | null;
          payment_order_id: string | null;
          receipt_url: string | null;
          notes: string | null;
          paid_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          amount: number;
          source: PaymentSource;
          razorpay_payment_id?: string | null;
          payment_order_id?: string | null;
          receipt_url?: string | null;
          notes?: string | null;
          paid_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fee_payments"]["Insert"]>;
      };
      payment_orders: {
        Row: {
          id: string;
          student_id: string | null;
          razorpay_order_id: string;
          amount: number;
          currency: string;
          status: string;
          webhook_payload: Record<string, unknown> | null;
          programme_id: string | null;
          batch_id: string | null;
          student_name: string | null;
          student_phone: string | null;
          student_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          razorpay_order_id: string;
          amount: number;
          currency?: string;
          status?: string;
          webhook_payload?: Record<string, unknown> | null;
          programme_id?: string | null;
          batch_id?: string | null;
          student_name?: string | null;
          student_phone?: string | null;
          student_email?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["payment_orders"]["Insert"]>;
      };
      broadcast_logs: {
        Row: {
          id: string;
          message: string;
          template_name: string | null;
          recipients: Record<string, unknown> | null;
          recipient_count: number;
          sent_by: string | null;
          sent_at: string;
        };
        Insert: {
          id?: string;
          message: string;
          template_name?: string | null;
          recipients?: Record<string, unknown> | null;
          recipient_count?: number;
          sent_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["broadcast_logs"]["Insert"]>;
      };
      studio_rentals: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          preferred_date: string;
          preferred_time_start: string;
          preferred_time_end: string;
          status: RentalStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          preferred_date: string;
          preferred_time_start: string;
          preferred_time_end: string;
          status?: RentalStatus;
          admin_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["studio_rentals"]["Insert"]>;
      };
      gallery: {
        Row: {
          id: string;
          url: string;
          thumbnail_url: string | null;
          type: GalleryType;
          title: string | null;
          tags: string[] | null;
          programme_id: string | null;
          is_visible: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          thumbnail_url?: string | null;
          type: GalleryType;
          title?: string | null;
          tags?: string[] | null;
          programme_id?: string | null;
          is_visible?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      site_content: {
        Row: {
          id: string;
          content_key: string;
          content_value: Record<string, unknown> | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          content_key: string;
          content_value?: Record<string, unknown> | null;
          updated_by?: string | null;
        };
        Update: {
          content_value?: Record<string, unknown> | null;
          updated_by?: string | null;
        };
      };
      kuchipudi_progress: {
        Row: {
          id: string;
          student_id: string;
          current_level: string;
          modules_completed: Record<string, unknown>[];
          certificate_urls: Record<string, string>;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          current_level?: string;
          modules_completed?: Record<string, unknown>[];
          certificate_urls?: Record<string, string>;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["kuchipudi_progress"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          cover_image_url: string | null;
          meta_description: string | null;
          tags: string[] | null;
          is_published: boolean;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          excerpt?: string | null;
          cover_image_url?: string | null;
          meta_description?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
    };
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_dashboard_analytics: {
        Args: Record<string, never>;
        Returns: Record<string, unknown>;
      };
      get_student_attendance_summary: {
        Args: { p_student_id: string };
        Returns: Record<string, unknown>;
      };
      check_consecutive_absences: {
        Args: { p_student_id: string; p_threshold: number };
        Returns: boolean;
      };
      increment_batch_enrollment: {
        Args: { p_batch_id: string };
        Returns: boolean;
      };
      decrement_batch_enrollment: {
        Args: { p_batch_id: string };
        Returns: boolean;
      };
    };
  };
}
