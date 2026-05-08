import { useState } from "preact/hooks";

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminPasswordAdmin({ hasExistingPassword = true }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  function updateField(event) {
    const { name, value } = event.currentTarget;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not update password.");
      }

      setForm(INITIAL_FORM);
      setStatus({
        type: "success",
        message: data.message || "Password updated. Please log in again.",
      });

      window.setTimeout(() => {
        window.location.href = data.redirectTo || "/admin/login";
      }, 900);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not update password.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main class="min-h-screen bg-slate-50 py-10">
      <section class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Security
          </p>
          <h1 class="mt-1 text-3xl font-bold text-slate-950">
            Change Admin Password
          </h1>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            {hasExistingPassword
              ? "Enter the current password and choose a stronger replacement. You will be logged out after the update."
              : "Create the first admin password for this site."}
          </p>

          {status.message && (
            <div
              class={`mt-5 rounded-md border px-4 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} class="mt-6 grid gap-5">
            {hasExistingPassword && (
              <label class="grid gap-2 text-sm font-semibold text-slate-700">
                Current Password
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onInput={updateField}
                  autocomplete="current-password"
                  required
                  class="rounded-md border border-slate-300 px-3 py-2 text-base font-normal text-slate-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
            )}

            <label class="grid gap-2 text-sm font-semibold text-slate-700">
              New Password
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onInput={updateField}
                autocomplete="new-password"
                minlength="12"
                required
                class="rounded-md border border-slate-300 px-3 py-2 text-base font-normal text-slate-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label class="grid gap-2 text-sm font-semibold text-slate-700">
              Confirm New Password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onInput={updateField}
                autocomplete="new-password"
                minlength="12"
                required
                class="rounded-md border border-slate-300 px-3 py-2 text-base font-normal text-slate-950 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <button
              type="submit"
              disabled={isSaving}
              class="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
