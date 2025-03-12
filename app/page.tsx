import { AuthForm } from "@/components/AuthForm";
import { ToggleTheme } from "@/components/ToggleTheme";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <div className="flex gap-5 justify-center ">
          <h1 className="mb-6 text-center text-3xl font-bold">Welcome</h1>

          <ToggleTheme />
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
