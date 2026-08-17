import { ProfileCompletionBreakdown } from "@/types";
import { prisma } from "./prisma";

export async function calculateStudentProfileCompletion(
  studentId: string
): Promise<ProfileCompletionBreakdown> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      academicRecord: true,
      skills: true,
      projects: true,
      resumes: true,
      certifications: true,
      internships: true,
    },
  });

  if (!student) {
    return {
      totalPercentage: 0,
      categories: [],
    };
  }

  const personalCompleted = Boolean(
    student.phone && student.dob && student.gender && student.address && student.resumeSummary
  );
  const academicCompleted = Boolean(
    student.academicRecord &&
    student.academicRecord.cgpa > 0 &&
    student.academicRecord.tenthPercentage > 0 &&
    (student.academicRecord.twelfthPercentage || student.academicRecord.diplomaPercentage)
  );
  const skillsCompleted = student.skills.length >= 3;
  const projectsCompleted = student.projects.length >= 1;
  const resumeCompleted = student.resumes.length >= 1;
  const extraCompleted = student.certifications.length >= 1 || student.internships.length >= 1;

  const categories = [
    {
      name: "Personal Information",
      weight: 20,
      completed: personalCompleted,
      earned: personalCompleted ? 20 : 10,
      actionRequired: personalCompleted ? undefined : "Add phone, DOB, address, and career summary.",
    },
    {
      name: "Academic Details",
      weight: 25,
      completed: academicCompleted,
      earned: academicCompleted ? 25 : 10,
      actionRequired: academicCompleted ? undefined : "Fill 10th, 12th/Diploma, and verified CGPA records.",
    },
    {
      name: "Technical Skills",
      weight: 15,
      completed: skillsCompleted,
      earned: skillsCompleted ? 15 : Math.round((student.skills.length / 3) * 15),
      actionRequired: skillsCompleted ? undefined : `Add at least 3 skills (current: ${student.skills.length}/3).`,
    },
    {
      name: "Projects & Portfolio",
      weight: 15,
      completed: projectsCompleted,
      earned: projectsCompleted ? 15 : 0,
      actionRequired: projectsCompleted ? undefined : "Add at least 1 technical project to highlight your work.",
    },
    {
      name: "Resume Upload",
      weight: 15,
      completed: resumeCompleted,
      earned: resumeCompleted ? 15 : 0,
      actionRequired: resumeCompleted ? undefined : "Upload an updated PDF resume.",
    },
    {
      name: "Certifications & Internships",
      weight: 10,
      completed: extraCompleted,
      earned: extraCompleted ? 10 : 0,
      actionRequired: extraCompleted ? undefined : "Add an industry certification or internship experience.",
    },
  ];

  const totalPercentage = categories.reduce((sum, c) => sum + c.earned, 0);

  // Update profile completion in DB if changed
  if (student.profileCompletion !== totalPercentage) {
    await prisma.student.update({
      where: { id: studentId },
      data: { profileCompletion: totalPercentage },
    });
  }

  return {
    totalPercentage,
    categories,
  };
}
