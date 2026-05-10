import { useState, useEffect } from "react";

export function useTypewriter(texts: string[], speed = 75) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) {
      const t = setTimeout(() => setPause(false), 1800);
      return () => clearTimeout(t);
    }
    const cur = texts[idx];
    if (!deleting && displayed.length < cur.length) {
      const t = setTimeout(
        () => setDisplayed(cur.slice(0, displayed.length + 1)),
        speed
      );
      return () => clearTimeout(t);
    } else if (!deleting && displayed.length === cur.length) {
      setPause(true);
      setDeleting(true);
    } else if (deleting && displayed.length > 0) {
      const t = setTimeout(
        () => setDisplayed(displayed.slice(0, -1)),
        speed / 2
      );
      return () => clearTimeout(t);
    } else {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }
  }, [displayed, deleting, pause, idx, texts, speed]);

  return displayed;
}
