import { SignUp } from "@stackframe/stack";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <SignUp
          fullPage={true}
          automaticRedirect={true}
          extraInfo={
            <div className="text-center">
              <p className="text-sm text-gray-600">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms
                </a>
              </p>
            </div>
          }
        />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
