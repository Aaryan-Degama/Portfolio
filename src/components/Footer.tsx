export function Footer() {
  return (
    <footer className="px-6 sm:px-12 py-8 flex items-center justify-between text-xs text-[var(--fg-muted)] border-t border-[var(--border)]">
      <span>Designed &amp; built by Aaryan Degama, © {new Date().getFullYear()}</span>
      <a href="#top" className="hover:text-[var(--fg)] transition-colors">
        Back to top ↑
      </a>
    </footer>
  );
}
