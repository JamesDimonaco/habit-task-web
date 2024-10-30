import { SignupForm } from "@/components/forms/signup-form";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm />
    </div>
  );
}
