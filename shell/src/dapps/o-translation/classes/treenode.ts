import { I18n } from "../../../shared/api/data/types";

export type StateSnapshot = {
  [key: string]: boolean;
};

export class CTreeNode {
  public add(key: string, value: I18n) {
    let keyParts = key.split(".");
    let currentNode: CTreeNode = this;
    while (currentNode && keyParts.length) {
      const keyPart = keyParts.shift();
      const childNode = currentNode.findChildByKey(keyPart);
      if (childNode) {
        currentNode = childNode;
      } else {
        keyParts = [keyPart].concat(keyParts);
        while (keyParts.length) {
          const remainingKeyPart = keyParts.shift();
          const newNode = new CTreeNode(remainingKeyPart, currentNode);
          if (!currentNode._parent) {
            currentNode._snapId = currentNode.key;
          }
          currentNode._children.push(newNode);
          currentNode = newNode;

          if (currentNode._parent) {
            currentNode._snapId = currentNode.parent._snapId + "." + currentNode.key;
          }
        }
      }
      if (keyParts.length == 0) {
        currentNode._values.push(value);
      }
    }
    return currentNode;
  }

  public createStateSnapshot(): StateSnapshot {
    let stateSnapshot: StateSnapshot = {};
    loopOverTree(this);

    function loopOverTree(tree: CTreeNode) {
      for (let i = 0; i < tree._children.length; i++) {
        stateSnapshot[tree._snapId] = tree._isExpanded;

        loopOverTree(tree._children[i]);
      }
    }
    return stateSnapshot;
  }

  private _snapId: string = "";

  public get snapId(): string {
    return this._snapId;
  }

  public get expandState(): boolean {
    return this._isExpanded;
  }

  public get children(): CTreeNode[] {
    return this._children;
  }
  private _children: CTreeNode[] = [];

  public get isLeaf(): boolean {
    return this._values.length > 0;
  }

  public get values(): I18n[] {
    return this._values;
  }
  private _values: I18n[] = [];

  public get key(): string {
    return this._key;
  }
  private readonly _key: string;

  private _isExpanded: boolean = false;

  public get isExpanded(): boolean {
    return this._isExpanded;
  }

  public toggleExpanded(): void {
    this._isExpanded = !this._isExpanded;
  }

  private _parent: CTreeNode;

  public get parent(): CTreeNode {
    return this._parent;
  }
  
  constructor(key: string, parent?: CTreeNode) {
    this._key = key;
    this._parent = parent;
  }

  public findChildByKey(keyPart: string): CTreeNode {
    return this.children.find((o) => o.key == keyPart);
  }

  public restoreStateSnapshot(stateSnapshot: StateSnapshot): void {
    function restoreLoop(tree: CTreeNode) {
      for (let i = 0; i < tree._children.length; i++) {
        tree._isExpanded = stateSnapshot[tree._snapId];
        restoreLoop(tree._children[i]);
      }
    }
    return restoreLoop(this);
  }
}
