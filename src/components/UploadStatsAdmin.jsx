import { useEffect, useMemo, useState } from "preact/hooks";

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1,
  );
  const size = value / 1024 ** exponent;
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDate(value) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

function getLocalDateValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWithinDateRange(value, fromDate, toDate) {
  const dateValue = getLocalDateValue(value);
  if (!dateValue) return false;
  if (fromDate && dateValue < fromDate) return false;
  if (toDate && dateValue > toDate) return false;
  return true;
}

function getDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function sortBySubmitTimeDesc(files) {
  return [...files].sort(
    (first, second) => getDateTime(second.modifiedAt) - getDateTime(first.modifiedAt),
  );
}

export default function UploadStatsAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState("");
  const [deletingKey, setDeletingKey] = useState("");

  async function loadStats() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/upload-stats", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not load upload stats.");
      }
      setStats(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const folders = stats?.folders || [];
  const files = useMemo(() => {
    const allFiles = folders.flatMap((folder) => folder.files || []);
    const folderFiltered =
      activeFolder === "all"
        ? allFiles
        : allFiles.filter(
            (file) => `${file.storage}:${file.folder}` === activeFolder,
          );
    const dateFiltered =
      fromDate || toDate
        ? folderFiltered.filter((file) =>
            isWithinDateRange(file.modifiedAt, fromDate, toDate),
          )
        : folderFiltered;
    const search = query.trim().toLowerCase();
    if (!search) return sortBySubmitTimeDesc(dateFiltered);

    return sortBySubmitTimeDesc(
      dateFiltered.filter((file) =>
        [file.name, file.path, file.folder, file.storage]
          .join(" ")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [activeFolder, folders, fromDate, query, toDate]);

  const biggestFolders = [...folders]
    .filter((folder) => folder.count > 0)
    .sort((a, b) => b.totalSize - a.totalSize);

  async function deleteImage(file) {
    const key = `${file.storage}:${file.path}`;
    const confirmed = window.confirm(
      `Delete this image?\n\n${file.path}\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingKey(key);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/delete-upload-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storage: file.storage,
          path: file.path,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not delete image.");
      }

      await loadStats();
      setMessage(`Deleted ${file.name}.`);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingKey("");
    }
  }

  if (loading) {
    return (
      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div class="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
          <p class="mt-4 text-sm text-slate-600">Loading upload statistics...</p>
        </div>
      </section>
    );
  }

  return (
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-950">Uploaded Images</h2>
          <p class="mt-1 text-sm text-slate-600">
            Last checked {formatDate(stats?.generatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={loadStats}
          class="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div class="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      )}
      {message && (
        <div class="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {message}
        </div>
      )}

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Total Images</p>
          <p class="mt-2 text-3xl font-bold text-slate-950">{stats?.totalImages || 0}</p>
        </div>
        <div class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Total Size</p>
          <p class="mt-2 text-3xl font-bold text-slate-950">
            {formatBytes(stats?.totalSize)}
          </p>
        </div>
        <div class="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-medium text-slate-500">Folders With Images</p>
          <p class="mt-2 text-3xl font-bold text-slate-950">
            {biggestFolders.length}
          </p>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)]">
        <div class="rounded-md border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 p-5">
            <h3 class="text-lg font-bold text-slate-950">Folders</h3>
          </div>
          <div class="divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => setActiveFolder("all")}
              class={`grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 text-left ${
                activeFolder === "all" ? "bg-blue-50" : "hover:bg-slate-50"
              }`}
            >
              <span>
                <span class="block font-semibold text-slate-950">All folders</span>
                <span class="mt-1 block text-xs text-slate-500">Every scanned location</span>
              </span>
              <span class="text-right text-sm font-semibold text-slate-700">
                {stats?.totalImages || 0}
                <span class="block text-xs font-normal text-slate-500">
                  {formatBytes(stats?.totalSize)}
                </span>
              </span>
            </button>

            {folders.map((folder) => {
              const key = `${folder.storage}:${folder.folder}`;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveFolder(key)}
                  class={`grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 text-left ${
                    activeFolder === key ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span class="min-w-0">
                    <span class="block truncate font-semibold text-slate-950">
                      {folder.label}
                    </span>
                    <span class="mt-1 block truncate text-xs text-slate-500">
                      {folder.folder} - {folder.storage}
                    </span>
                  </span>
                  <span class="text-right text-sm font-semibold text-slate-700">
                    {folder.count}
                    <span class="block text-xs font-normal text-slate-500">
                      {formatBytes(folder.totalSize)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div class="rounded-md border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 p-5">
            <div class="flex flex-col gap-3">
              <div>
                <h3 class="text-lg font-bold text-slate-950">Files</h3>
                <p class="mt-1 text-sm text-slate-500">
                  Showing {files.length} image{files.length === 1 ? "" : "s"}
                </p>
              </div>
              <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
                <input
                  type="search"
                  value={query}
                  onInput={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Search files or folders"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  From
                  <input
                    type="date"
                    value={fromDate}
                    onInput={(event) => setFromDate(event.currentTarget.value)}
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case tracking-normal text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  To
                  <input
                    type="date"
                    value={toDate}
                    onInput={(event) => setToDate(event.currentTarget.value)}
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case tracking-normal text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                {(query || fromDate || toDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setFromDate("");
                      setToDate("");
                    }}
                    class="mt-auto w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div class="max-h-[650px] overflow-auto">
            {files.length > 0 ? (
              <table class="w-full min-w-[840px] text-left text-sm">
                <thead class="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th class="px-4 py-3 font-semibold">File</th>
                    <th class="px-4 py-3 font-semibold">Folder</th>
                    <th class="px-4 py-3 font-semibold">Size</th>
                    <th class="px-4 py-3 font-semibold">Modified</th>
                    <th class="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {files.map((file) => {
                    const key = `${file.storage}:${file.path}`;
                    const isDeleting = deletingKey === key;
                    return (
                      <tr key={key} class="hover:bg-slate-50">
                        <td class="px-4 py-4">
                          <div class="flex items-center gap-4">
                            {file.url ? (
                              <img
                                src={file.url}
                                alt=""
                                class="h-20 w-20 rounded-md border border-slate-200 object-cover shadow-sm"
                                loading="lazy"
                              />
                            ) : (
                              <div class="h-20 w-20 rounded-md bg-slate-100" />
                            )}
                            <div class="min-w-0">
                              <p class="truncate font-semibold text-slate-900">
                                {file.name}
                              </p>
                              <p class="truncate text-xs text-slate-500">{file.path}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-slate-600">{file.folder}</td>
                        <td class="px-4 py-3 font-semibold text-slate-800">
                          {formatBytes(file.size)}
                        </td>
                        <td class="px-4 py-3 text-slate-600">
                          <span>{formatDate(file.modifiedAt)}</span>
                          <span class="block text-xs text-slate-400">
                            {getLocalDateValue(file.modifiedAt)}
                          </span>
                        </td>
                        <td class="px-4 py-3">
                          <button
                            type="button"
                            disabled={Boolean(deletingKey)}
                            onClick={() => deleteImage(file)}
                            class="rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div class="p-8 text-center text-slate-500">
                No images found for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
