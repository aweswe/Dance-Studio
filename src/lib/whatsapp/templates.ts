/**
 * WhatsApp message templates.
 * Template names must match the templates configured in your WATI/Interakt dashboard.
 */

export const WHATSAPP_TEMPLATES = {
  /** Sent after successful enrolment payment */
  welcome: {
    name: "enrolment_welcome",
    variables: (data: {
      studentName: string;
      programmeName: string;
      loginUrl: string;
    }) => ({
      student_name: data.studentName,
      programme_name: data.programmeName,
      login_url: data.loginUrl,
    }),
  },

  /** Sent after every successful Razorpay payment */
  paymentReceipt: {
    name: "payment_receipt",
    variables: (data: {
      studentName: string;
      amount: string;
      date: string;
      transactionId: string;
    }) => ({
      student_name: data.studentName,
      amount: data.amount,
      date: data.date,
      transaction_id: data.transactionId,
    }),
  },

  /** Sent N days before fee due date */
  feeReminder: {
    name: "fee_reminder",
    variables: (data: {
      studentName: string;
      amount: string;
      dueDate: string;
      paymentLink: string;
    }) => ({
      student_name: data.studentName,
      amount: data.amount,
      due_date: data.dueDate,
      payment_link: data.paymentLink,
    }),
  },

  /** Sent after N consecutive absences */
  absenceCheckIn: {
    name: "absence_checkin",
    variables: (data: {
      studentName: string;
      absenceCount: string;
      programmeName: string;
    }) => ({
      student_name: data.studentName,
      absence_count: data.absenceCount,
      programme_name: data.programmeName,
    }),
  },

  /** Admin broadcast message */
  broadcast: {
    name: "admin_broadcast",
    variables: (data: { message: string }) => ({
      message: data.message,
    }),
  },

  /** Studio rental confirmed */
  rentalConfirmed: {
    name: "rental_confirmed",
    variables: (data: {
      name: string;
      date: string;
      time: string;
    }) => ({
      renter_name: data.name,
      date: data.date,
      time: data.time,
    }),
  },

  /** Studio rental declined */
  rentalCancelled: {
    name: "rental_cancelled",
    variables: (data: {
      name: string;
      date: string;
      time: string;
    }) => ({
      renter_name: data.name,
      date: data.date,
      time: data.time,
    }),
  },

  /** Kuchipudi certificate ready */
  certificateReady: {
    name: "certificate_ready",
    variables: (data: {
      studentName: string;
      level: string;
      downloadUrl: string;
    }) => ({
      student_name: data.studentName,
      level: data.level,
      download_url: data.downloadUrl,
    }),
  },

  /** Schedule change notification */
  scheduleChange: {
    name: "schedule_change",
    variables: (data: {
      studentName: string;
      programmeName: string;
      oldSchedule: string;
      newSchedule: string;
    }) => ({
      student_name: data.studentName,
      programme_name: data.programmeName,
      old_schedule: data.oldSchedule,
      new_schedule: data.newSchedule,
    }),
  },
} as const;
