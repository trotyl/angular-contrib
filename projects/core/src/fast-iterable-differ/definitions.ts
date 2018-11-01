export interface ItemNode {
  item: any;
  key: any;
  from: number | null;
  to: number | null;
  index: number;
  link: ItemNode | null;
}

export interface Container {
  append(node: ItemNode): void;
  remove(node: ItemNode): void;
  insertBefore(newNode: ItemNode, nextNode: ItemNode): void;
  checkIdentity(lastNode: ItemNode, newNode: ItemNode): void;
}

export interface Operation {
  node: ItemNode;
  previousIndex: number | null;
  currentIndex: number | null;
}
