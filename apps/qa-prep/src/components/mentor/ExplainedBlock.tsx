import type { ReactNode } from 'react';

type ExplainedBlockProps = {
  text: string;
  label?: string;
  children?: ReactNode;
};

export function ExplainedBlock({ text, children }: ExplainedBlockProps) {
  const content = children ?? <p>{text}</p>;
  return (
    <div className="explained-block">
      <div className="explained-block__body">{content}</div>
    </div>
  );
}
