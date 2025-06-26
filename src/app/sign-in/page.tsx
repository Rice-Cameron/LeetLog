import { SignIn } from "@stackframe/stack";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center sign-in-page-wrapper">
      <div className="max-w-md w-full">
        <SignIn
          fullPage={true}
          automaticRedirect={true}
          firstTab="password"
          extraInfo={
            <div className="text-center">
              <p className="text-sm text-gray-600">
                When signing in, you agree to our{" "}
                <a
                  href="/terms"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Terms
                </a>
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
