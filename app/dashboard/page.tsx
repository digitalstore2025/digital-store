import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-space text-white">
        <h1 className="text-2xl">يجب تسجيل الدخول أولاً 🔐</h1>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-space text-white text-center px-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">يجب شراء الخطة للوصول 🔒</h1>
          <p className="text-gray-400">تم تسجيل دخولك، لكن الحساب لا يملك وصولاً مدفوعًا بعد.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-white p-10">
      <h1 className="text-3xl font-bold mb-4">لوحة التحكم (مدفوعة)</h1>
      <p className="text-gray-400">أصبح الوصول الآن مبنيًا على الدفع الحقيقي المحفوظ في قاعدة البيانات.</p>
    </div>
  );
}
