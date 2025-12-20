'use client';

interface ConfirmationPopupProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export default function ConfirmationPopup({ isOpen, email, onClose }: ConfirmationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="mb-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Title & Message */}
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Check Your Email
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            We've sent a confirmation link to
            <span className="mx-1 font-semibold text-purple-600">{email}</span>.
            Please click it to verify your account.
          </p>
        </div>

        {/* Help Text */}
        <div className="mb-6 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <p className="mb-1">
            <strong>Didn't receive the email?</strong>
          </p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Check your spam or junk folder.</li>
            <li>Make sure you entered the correct email address.</li>
            <li>Wait a few minutes—it can sometimes be delayed.</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
}