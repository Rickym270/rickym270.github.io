import type { DecisionTreeNode } from '../../types/mentorContent';

type DecisionTreeViewProps = {
  tree: DecisionTreeNode;
};

type DecisionTreeBranchProps = {
  tree: DecisionTreeNode;
  depth: number;
};

function renderLeaf(value: DecisionTreeNode | string, depth: number): React.ReactNode {
  if (typeof value === 'string') {
    return <p className="decision-tree__leaf">{value}</p>;
  }
  return <DecisionTreeBranch tree={value} depth={depth + 1} />;
}

function DecisionTreeBranch({ tree, depth }: DecisionTreeBranchProps) {
  return (
    <div className={`decision-tree__node decision-tree__node--depth-${depth}`}>
      <p className="decision-tree__question">{tree.question}</p>
      <div className="decision-tree__branch">
        <div className="decision-tree__path">
          <span className="decision-tree__label">YES</span>
          {renderLeaf(tree.yes, depth)}
        </div>
        <div className="decision-tree__path">
          <span className="decision-tree__label">NO</span>
          {renderLeaf(tree.no, depth)}
        </div>
      </div>
    </div>
  );
}

export function DecisionTreeView({ tree }: DecisionTreeViewProps) {
  return (
    <div className="decision-tree">
      <DecisionTreeBranch tree={tree} depth={0} />
    </div>
  );
}
