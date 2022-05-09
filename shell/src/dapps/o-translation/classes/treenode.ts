import { I18n } from "../../../shared/api/data/types";

type StateSnapshot = string;

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

  public createSatateSnapshot(): StateSnapshot{
    return "";
  }

  public restroeStateSnapshot(stateSnapshot: StateSnapshot) {

  }
}