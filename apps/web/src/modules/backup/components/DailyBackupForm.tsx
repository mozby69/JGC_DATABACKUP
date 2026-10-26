"use client";
import { useRef, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import {
  BACKUP_MAX_FILES,
  BACKUP_MAX_FILE_BYTES,
  backupInputSchema,
} from "@repo/shared";
import { useBackupContext, useUploadBackup } from "../hooks/useBackups";
import toast from "react-hot-toast";

const field =
  "mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 disabled:bg-gray-100";
function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export default function DailyBackupForm() {
  const context = useBackupContext();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [backupNo, setBackupNo] = useState("Generated on save");
  const formRef = useRef<HTMLFormElement>(null);
  const upload = useUploadBackup(setProgress);
  const branch = context.data?.branch;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setProgress(0);
    const data = new FormData(event.currentTarget);
    const input = backupInputSchema.safeParse({
      backupDate: data.get("backupDate"),
      subject: data.get("subject"),
    });
    if (!input.success) {
      setError(input.error.issues[0].message);
      return;
    }
    const files = data
      .getAll("attachments")
      .filter(
        (value): value is File =>
          value instanceof File && value.name.length > 0,
      );
    if (
      !files.length ||
      files.length > BACKUP_MAX_FILES ||
      files.some((file) => file.size > BACKUP_MAX_FILE_BYTES)
    ) {
      setError(`Choose 1–${BACKUP_MAX_FILES} files, up to 1 GB each.`);
      return;
    }
    try {
      const result = await upload.mutateAsync({ input: input.data, files });
      setBackupNo(result.backupNo);
      formRef.current?.reset();
      toast.success("Backup uploaded successfully");
    } catch (err) {
      setError(
        isAxiosError(err)
          ? (err.response?.data?.message ??
              "Upload failed. Check your connection and try again.")
          : "Upload failed.",
      );
    }
  }
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Daily Backup</h2>
      {context.isPending ? (
        <p className="mt-4">Loading your branch...</p>
      ) : context.isError ? (
        <p role="alert" className="mt-4 text-red-700">
          Unable to load your branch.{" "}
          <button onClick={() => context.refetch()} className="underline">
            Retry
          </button>
        </p>
      ) : !branch ? (
        <p role="alert" className="mt-4 text-amber-800">
          Ask superadmin to assign your account to a branch before uploading.
        </p>
      ) : !branch.isActive ? (
        <p role="alert" className="mt-4 text-amber-800">
          Your branch is inactive. Contact superadmin.
        </p>
      ) : (
        <form ref={formRef} onSubmit={submit} className="mt-5">
          <fieldset
            disabled={upload.isPending}
            className="grid gap-5 md:grid-cols-3"
          >
            <label className="text-sm font-medium">
              Backup No.
              <input className={field} value={backupNo} readOnly />
            </label>
            <label className="text-sm font-medium">
              Branch Name
              <input className={field} value={branch.branchName} readOnly />
            </label>
            <label className="text-sm font-medium">
              Date
              <input
                className={field}
                type="date"
                name="backupDate"
                required
                defaultValue={today()}
              />
            </label>
            <label className="text-sm font-medium">
              Subject
              <textarea
                className={field}
                name="subject"
                placeholder="Enter subject"
                maxLength={500}
                rows={3}
                required
              />
            </label>
            <label className="text-sm font-medium md:col-span-2">
              Attachments
              <input
                className={field}
                type="file"
                name="attachments"
                multiple
                required
              />
              <span className="mt-2 block text-xs text-gray-500">
                Up to {BACKUP_MAX_FILES} files, 1 GB per file. Keep this page
                open until the SFTP transfer completes.
              </span>
            </label>
          </fieldset>
          {upload.isPending && (
            <div role="status" className="mt-4 text-sm text-emerald-800">
              <progress value={progress} max={100} className="mr-3" />
              {progress < 100
                ? `Uploading to server: ${progress}%`
                : "Transferring to branch through SFTP..."}
            </div>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-3 border-t pt-4">
            <a className="rounded-lg border px-5 py-2" href="#backup-listing">
              Listing
            </a>
            <button
              type="submit"
              disabled={upload.isPending}
              className="rounded-lg bg-emerald-700 px-5 py-2 text-white disabled:opacity-50"
            >
              {upload.isPending ? "Saving..." : "Save Backup"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
