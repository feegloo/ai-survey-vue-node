import { useMemo, useState } from "react";

export function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useMemo(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
  };

  return { pathname, navigate };
}
