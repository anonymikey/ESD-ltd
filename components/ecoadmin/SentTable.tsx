"use client";

import { useMemo, useState, useTransition } from "react";
import StatusBadge from "@/components/ecoadmin/StatusBadge";
import { deleteLogsOlderThan, deleteSelectedLogs, deleteSingleLog } from "@/app/ecoadmin/(admin)/sent/actions";

export interface SentLogRow {
  id: string;
  to: string[];
  subject: string;
  status: string;
  createdAt: string;
}

const RETENTION_OPTIONS = [30, 90, 180, 365];

export default function SentTable({
  logs,
  defaultRetentionDays,
}: {
  logs: SentLogRow[];
  defaultRetentionDays: number;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [olderThanDays, setOlderThanDays] = useState<number>(defaultRetentionDays);

  const allSelected = logs.length > 0 && selected.size === logs.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(logs.map((l) => l.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDeleteOne(id: string) {
    if (!window.confirm("Delete this record from the EcoAdmin audit log? This cannot be undone. The email itself was already sent and is not affected.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteSingleLog(id);
      setMessage(result.error ?? `Deleted 1 record.`);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  }

  function handleDeleteSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Delete ${ids.length} selected record${ids.length === 1 ? "" : "s"} from the EcoAdmin audit log? This cannot be undone. The emails themselves were already sent and are not affected.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteSelectedLogs(ids);
      setMessage(result.error ?? `Deleted ${result.deleted} record${result.deleted === 1 ? "" : "s"}.`);
      setSelected(new Set());
    });
  }

  function handleDeleteOlderThan() {
    if (
      !window.confirm(
        `Delete every audit record older than ${olderThanDays} days? This cannot be undone. The emails themselves were already sent and are not affected.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteLogsOlderThan(olderThanDays);
      setMessage(result.error ?? `Deleted ${result.deleted} record${result.deleted === 1 ? "" : "s"} older than ${olderThanDays} days.`);
      setSelected(new Set());
    });
  }

  const selectedCount = selected.size;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-charcoal/45">
          Cleanup
        </span>
        <button
          type="button"
          onClick={handleDeleteSelected}
          disabled={selectedCount === 0 || isPending}
          className="rounded-sm border border-charcoal/20 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal hover:border-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete selected {selectedCount > 0 ? `(${selectedCount})` : ""}
        </button>

        <span className="mx-1 h-4 w-px bg-charcoal/10" aria-hidden="true" />

        <label htmlFor="olderThan" className="font-body text-xs text-charcoal/55">
          Delete records older than
        </label>
        <select
          id="olderThan"
          value={olderThanDays}
          onChange={(e) => setOlderThanDays(Number(e.target.value))}
          className="rounded-sm border border-charcoal/15 bg-white px-2 py-1.5 font-body text-xs text-charcoal focus:border-bronze"
        >
          {RETENTION_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d} days
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleDeleteOlderThan}
          disabled={isPending}
          className="rounded-sm border border-charcoal/20 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal hover:border-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Run cleanup
        </button>

        {message && (
          <span role="status" className="font-body text-xs text-charcoal/60">
            {message}
          </span>
        )}
      </div>

      <p className="mb-4 font-body text-xs leading-relaxed text-charcoal/45">
        Deleting a record removes it from this audit log only — it does not delete, recall, or
        affect the actual email in Resend, Gmail, Outlook, or the recipient&rsquo;s mailbox.
      </p>

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        {logs.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-body text-sm text-charcoal/50">No emails sent yet.</p>
          </div>
        )}

        {logs.length > 0 && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-charcoal/10">
                <th scope="col" className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                    className="h-4 w-4 accent-bronze"
                  />
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-charcoal/45">
                  Recipient
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-charcoal/45">
                  Subject
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-charcoal/45">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-charcoal/45">
                  Sent
                </th>
                <th scope="col" className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-charcoal/5 last:border-0">
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.has(log.id)}
                      onChange={() => toggleOne(log.id)}
                      aria-label={`Select record for ${log.subject}`}
                      className="h-4 w-4 accent-bronze"
                    />
                  </td>
                  <td className="px-5 py-3.5 font-body text-sm text-charcoal/80">
                    {log.to[0] ?? "—"}
                    {log.to.length > 1 && <span className="ml-1 text-charcoal/40">+{log.to.length - 1}</span>}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3.5 font-body text-sm text-charcoal/80">{log.subject}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-body text-xs text-charcoal/45">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteOne(log.id)}
                      disabled={isPending}
                      className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/40 hover:text-[#C2483B] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
