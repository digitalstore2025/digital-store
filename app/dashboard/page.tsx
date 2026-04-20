import { hasActiveAccess } from "@/lib/subscription";

export default async function Dashboard() {
  const allowed = await hasActiveAccess();

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-space text-white">
        <h1 className="text-2xl">يجب شراء الخطة للوصول 🔒</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-white p-10">
      <h1 className="text-3xl font-bold">لوحة التحكم (مدفوعة)</h1>
    </div>
  );
}
