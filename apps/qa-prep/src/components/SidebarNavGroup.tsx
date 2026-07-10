import type { ReactNode } from 'react';

type SidebarNavGroupProps = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function SidebarNavGroup({
  title,
  count,
  defaultOpen = false,
  children,
}: SidebarNavGroupProps) {
  return (
    <details className="sidebar-nav-group" open={defaultOpen}>
      <summary className="sidebar-nav-group__summary">
        <span className="sidebar-nav-group__title">{title}</span>
        <span className="sidebar-nav-group__count" aria-hidden="true">
          {count}
        </span>
      </summary>
      <div className="sidebar-nav-group__body">{children}</div>
    </details>
  );
}
