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
          const newNode = new CTreeNode(remainingKeyPart);
          currentNode._children.push(newNode);
          currentNode = newNode;
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

    function loopOverTree(tree) {
      for (let i = 0; i < tree._children.length; i++) {
        stateSnapshot[tree._key] = tree._isExpanded;

        loopOverTree(tree._children[i]);
      }
    }
    console.log("states", stateSnapshot);
    return stateSnapshot;
  }

  public updateSnapshot(newSnapshot: StateSnapshot, oldSnapshot: StateSnapshot): StateSnapshot {
    let updatedSnapshot: StateSnapshot = {};

    for (let i = 0; i < Object.keys(newSnapshot).length; i++) {

//      console.log(Object.keys(newSnapshot)[i], Object.values(newSnapshot)[i])
      console.log("bla")
    }


    return updatedSnapshot;
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

  constructor(key: string) {
    this._key = key;
  }

  public findChildByKey(keyPart: string): CTreeNode {
    return this.children.find((o) => o.key == keyPart);
  }

  public restoreStateSnapshot(stateSnapshot: StateSnapshot): void {
    function restoreLoop(tree: CTreeNode) {
      for (let i = 0; i < tree._children.length; i++) {
        tree._isExpanded = stateSnapshot[tree._key];
        restoreLoop(tree._children[i]);
      }
    }
    return restoreLoop(this);
  }
}
