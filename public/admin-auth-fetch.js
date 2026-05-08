(() => {
  const csrfCookieName = "admin_csrf_token";
  const csrfHeaderName = "x-admin-csrf";
  const refreshPath = "/api/admin/refresh";

  function getCookie(name) {
    return document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) || "";
  }

  function isSameOrigin(url) {
    try {
      return new URL(url, window.location.origin).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  function getMethod(resource, init) {
    return String(init?.method || resource?.method || "GET").toUpperCase();
  }

  function isMutating(method) {
    return !["GET", "HEAD", "OPTIONS"].includes(method);
  }

  function withCsrfHeader(resource, init = {}) {
    const method = getMethod(resource, init);
    if (!isMutating(method) || !isSameOrigin(resource?.url || resource)) {
      return init;
    }

    const csrfToken = getCookie(csrfCookieName);
    if (!csrfToken) return init;

    const headers = new Headers(init.headers || resource?.headers || {});
    headers.set(csrfHeaderName, csrfToken);

    return { ...init, headers };
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (resource, init = {}) => {
    const requestUrl = String(resource?.url || resource || "");
    const protectedInit = withCsrfHeader(resource, init);
    const response = await originalFetch(resource, protectedInit);

    if (
      response.status !== 401 ||
      !isSameOrigin(requestUrl) ||
      requestUrl.includes(refreshPath)
    ) {
      return response;
    }

    const refreshResponse = await originalFetch(
      refreshPath,
      withCsrfHeader(refreshPath, { method: "POST" }),
    );

    if (!refreshResponse.ok) return response;

    return originalFetch(resource, withCsrfHeader(resource, init));
  };
})();
