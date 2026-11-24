import { getCurrentStudent } from "@/lib/auth/student";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";
import { ProfileForm } from "@/components/student/profile-form";
import { parseParentInfo, isAdultProgramme, isKidsProgramme } from "@/lib/students/parent-info";

export const metadata = {
  title: "My Profile | Student Dashboard",
};

export default async function ProfilePage() {
  const { student, user } = await getCurrentStudent();

  if (!student) redirect(ROUTES.login);

  const parentInfo = parseParentInfo(student, user);
  const isAdultClass = isAdultProgramme(student.programme, student.batch);
  const isKidsClass = isKidsProgramme(student.programme, student.batch);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2">Used for fees, notices, safety emergencies, and official academy updates.</p>

      <ProfileForm
        isAdultClass={isAdultClass}
        isKidsClass={isKidsClass}
        initial={{
          name: (student as any)?.name || "",
          phone: (student as any)?.phone || "",
          email: (student as any)?.email || "",
          photoUrl: (student as any)?.profile_photo_url || "",
          parentName: parentInfo.parentName,
          parentPhone: parentInfo.parentPhone,
          parentRelationship: parentInfo.parentRelationship,
        }}
      />
    </div>
  );
}
