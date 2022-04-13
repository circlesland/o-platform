import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import OpenLogin from "@toruslabs/openlogin";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";

export type EncryptedKey = {
  iv:  string,
  base64CypherText: string,
  privateKeyHash: null
};

export type Eoa = {
  address: string
  name: string
  encryptedPrivateKey: EncryptedKey|null
  privateKey: string|null
  isOwner: boolean
  source: "torus" | "imported" | "local" | null
}

export type AddressEoaMap = {
  [address:string]:Eoa
}

export class KeyManager {
  public get eoas() {
    return this._eoas;
  }
  private _eoas: AddressEoaMap = {};
  private _safeProxy: GnosisSafeProxy|null = null;

  constructor(safeAddress:string) {
    if (safeAddress) {
      this._safeProxy = new GnosisSafeProxy(RpcGateway.get(), safeAddress);
    }
  }

  async load() {
    const allEoas: AddressEoaMap = {};

    if (this._safeProxy) {
      const safeOwners = await this._safeProxy.getOwners();
      safeOwners.forEach(o => {
        allEoas[o] = {
          address: o,
          name: o,
          isOwner: true,
          encryptedPrivateKey: null,
          privateKey: null,
          source: null
        };
      });
    }

    const localStorageKeysJson = localStorage.getItem("circlesKeys");
    const localStorageKeysMap:AddressEoaMap = localStorageKeysJson ? JSON.parse(localStorageKeysJson) : {};

    Object.values(localStorageKeysMap).forEach(o => {
      let activeSafeOwnerEntry = allEoas[o.address];
      if (activeSafeOwnerEntry) {
        allEoas[o.address] = {
          ...activeSafeOwnerEntry,
          ...o,
          isOwner: true
        }
      } else {
        o.isOwner = false;
        allEoas[o.address] = o;
      }
    });

    this._eoas = allEoas;
    localStorage.setItem("circlesKeys", JSON.stringify(allEoas));
  }

  get torusKeyAddress() : string|null {
      const keys = Object.values(this._eoas).filter(o => o.source == "torus");
      if (keys.length == 0){
        return null;
      }
      return keys[0].address;
  }

  async getKey(address:string, passphrase:string) : Promise<string> {
    const keyEntry = this._eoas[address];
    if (!keyEntry || !keyEntry.encryptedPrivateKey) {
      throw new Error(`No key for address ${address}`);
    }

    const decryptedKeysJson = sessionStorage.getItem("keyCache");
    const decryptedKeysObj:AddressEoaMap = decryptedKeysJson ? JSON.parse(decryptedKeysJson) : {};
    if (decryptedKeysObj[address]) {
      return decryptedKeysObj[address].privateKey;
    }

    const decryptedKey = await this.decryptWithPassphrase(passphrase, keyEntry.encryptedPrivateKey);

    const keyEntryCopy:Eoa = JSON.parse(JSON.stringify(keyEntry));
    keyEntryCopy.privateKey = decryptedKey;

    decryptedKeysObj[keyEntryCopy.address] = keyEntryCopy;
    sessionStorage.setItem("keyCache", JSON.stringify(decryptedKeysObj));

    return decryptedKey;
  }

  async setKey(address:string, passphrase:string, privateKey:string) {
    const acc = RpcGateway.get().eth.accounts.privateKeyToAccount(privateKey);
    const localStorageKeysJson = localStorage.getItem("circlesKeys");
    const localStorageKeysMap:AddressEoaMap = localStorageKeysJson ? JSON.parse(localStorageKeysJson) : {};

    if (!localStorageKeysMap[acc.address]) {
      throw new Error(`Address ${address} is not known.`);
    }

    const encryptedPrivateKey = await this.encryptWithPassphrase(passphrase, privateKey);
    localStorageKeysMap[address] = {
      ...localStorageKeysMap[address],
      encryptedPrivateKey: encryptedPrivateKey
    }

    this._eoas = localStorageKeysMap;
    localStorage.setItem("circlesKeys", JSON.stringify(localStorageKeysMap));
  }

  async addEoa(name:string, privateKey:string, passphrase:string, source:"imported"|"torus"|"local") {
    if (passphrase.trim().length < 6) {
      throw new Error("Password must be at least six characters long");
    }

    const acc = RpcGateway.get().eth.accounts.privateKeyToAccount(privateKey);
    const localStorageKeysJson = localStorage.getItem("circlesKeys");
    const localStorageKeysMap:AddressEoaMap = localStorageKeysJson ? JSON.parse(localStorageKeysJson) : {};

    if (localStorageKeysMap[acc.address]) {
      throw new Error(`The eoa already exists`);
    }

    const encryptedPrivateKey = await this.encryptWithPassphrase(passphrase, privateKey);
    localStorageKeysMap[acc.address] = {
      address: acc.address,
      privateKey: null,
      source: source,
      name: name,
      isOwner: false,
      encryptedPrivateKey: encryptedPrivateKey
    };

    this._eoas = localStorageKeysMap;
    localStorage.setItem("circlesKeys", JSON.stringify(localStorageKeysMap));
  }

  async keyFromPassphrase(passphrase: string) {
    const passphraseBytes = Buffer.from(passphrase, "utf-8");
    const derivedKey = await crypto.subtle.digest({name: "SHA-256"}, passphraseBytes);
    return await crypto.subtle.importKey(
      "raw",
      derivedKey,
      {name: "AES-CBC"},
      false,
      ["encrypt", "decrypt"]);
  }

  async encryptWithPassphrase(passphrase:string, clearTextHexKey:string) : Promise<EncryptedKey> {
    const subtleKey = await this.keyFromPassphrase(passphrase);
    const keyBytes = Buffer.from(clearTextHexKey.replace("0x", ""), "hex");
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const cypherText = await crypto.subtle.encrypt(
      {name: "AES-CBC", iv},
      subtleKey,
      keyBytes);

    const digest = await crypto.subtle.digest("SHA-256", Buffer.from(clearTextHexKey));
    const verifyHash = Buffer.from(digest).toString("hex");

    return <EncryptedKey>{
      iv: Buffer.from(iv).toString("base64"),
      base64CypherText: Buffer.from(cypherText).toString("base64"),
      privateKeyHash: verifyHash
    };
  }

  async decryptWithPassphrase(passphrase: string, base64CypherText:{
    iv: string,
    base64CypherText: string,
    privateKeyHash: null
  }) : Promise<string> {
    const subtleKey = await this.keyFromPassphrase(passphrase);
    const base64CypherTextBytes = Buffer.from(base64CypherText.base64CypherText, "base64");
    const ivBytes = Buffer.from(base64CypherText.iv, "base64");
    const clearTextBytes = await crypto.subtle.decrypt(
      {name: "AES-CBC", iv: ivBytes},
      subtleKey,
      base64CypherTextBytes);
    const decryptedKey = "0x" + Buffer.from(clearTextBytes).toString("hex");
    const digest = await crypto.subtle.digest("SHA-256", Buffer.from(decryptedKey));
    const verifyHash = Buffer.from(digest).toString("hex");
    if (verifyHash != base64CypherText.privateKeyHash) {
      throw new Error(`Invalid pin`);
    }

    return decryptedKey;
  }
}