
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AddBackupFormProps = {
  branchName: string;
  backupNo?: string;
};

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 10);
}

export function AddBackupForm({
  branchName,
  backupNo = "Auto-generated",
}: AddBackupFormProps) {
  const router = useRouter();

  const [date, setDate] = useState(getToday());
  const [subject, setSubject] = useState("");
  const [attachment, setAttachment] = useState("");



  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Backend integration follows after the new fields
    // are supported by the Prisma model and API.
    console.log({
      date,
      subject,
      attachment,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-card p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Daily Backup
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Register your branchs daily backup.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Backup No.
          </label>
          <input
            value={backupNo}
            readOnly
            className="w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Branch Name
          </label>
          <input
            value={branchName}
            readOnly
            className="w-full rounded-md border bg-muted/40 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="backupDate"
            className="text-sm font-medium"
          >
            Date
          </label>
          <input
            id="backupDate"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="text-sm font-medium"
          >
            Subject
          </label>
          <textarea
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Enter subject"
            rows={3}
            required
            className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="attachment"
            className="text-sm font-medium"
          >
            Attachment
          </label>
          <select
            id="attachment"
            value={attachment}
            onChange={(event) =>
              setAttachment(event.target.value)
            }
            required
            disabled
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm disabled:opacity-60"
          >
            <option value="">
              Available files (SFTP integration pending)
            </option>
          </select>
          <p className="text-xs text-muted-foreground">
            Select a file from your configured Windows backup folder.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-4">
        <button
          type="submit"
          disabled
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Save
        </button>

        <button
          type="button"
          onClick={() => router.push("/branch/backups")}
          className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Listing
        </button>
      </div>
    </form>
  );
}
