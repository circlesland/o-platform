import { addMessages, getLocaleFromNavigator, locale, init, format } from "svelte-i18n";
import { get } from "svelte/store";
import {
  I18n,
  QueryGetAllStringsByMaxVersionAndLangArgs,
  GetAllStringsByMaxVersionAndLangDocument,
} from "../shared/api/data/types";
import { ApiClient } from "../shared/apiConnection";
import { Environment } from "../shared/environment";

export class i18nDictionary {
  private i18nStrings: I18n[];
  private language = Environment.userLanguage.substring(0, 2);
  static readonly fallbackLanguage: string = "en";
  private static waitSignal: (value: any) => void; 
  public readonly waitHandle: Promise<any>;

  private static _instance?: i18nDictionary;

  static get instance(): i18nDictionary {
    if (!this._instance) {
      this._instance = new i18nDictionary();
      this._instance.init()
    }
    return this._instance;
  }
  private constructor() {
    this.waitHandle = new Promise<any>((resolve) => {i18nDictionary.waitSignal = resolve})
  }

  private buildI18nDictionary(sourceData: I18n[]): { [key: string]: string } {
    const i18nDictionary = {};
    for (let i = 0; i < sourceData.length; i++) {
      i18nDictionary[sourceData[i].key] = sourceData[i].value;
    }
    return i18nDictionary;
  }

  static async waitUntilInitialized(): Promise<any> {}

  private async init() {

    init({
      fallbackLocale: i18nDictionary.fallbackLanguage,
      initialLocale: getLocaleFromNavigator(),
    });

    locale.set(i18nDictionary.fallbackLanguage);


    const languageQueries: Promise<any>[] = []
    const fallbackLanguageQuery = ApiClient.query<I18n[], QueryGetAllStringsByMaxVersionAndLangArgs>(
      GetAllStringsByMaxVersionAndLangDocument,
      {
        lang: i18nDictionary.fallbackLanguage,
      }
    ).then((i18nResult) => {
      const i18nDictionary = this.buildI18nDictionary(i18nResult);
      addMessages(i18nDictionary.fallbackLanguage, i18nDictionary);
    });

    languageQueries.push(fallbackLanguageQuery)

    if (this.language !== i18nDictionary.fallbackLanguage) {
      locale.set(this.language);
      const userLanguageQuery = ApiClient.query<I18n[], QueryGetAllStringsByMaxVersionAndLangArgs>(
        GetAllStringsByMaxVersionAndLangDocument,
        {
          lang: this.language,
        }
      ).then((i18nResult) => {
        const i18nDictionary = this.buildI18nDictionary(i18nResult);
        addMessages(this.language, i18nDictionary);
      });

      languageQueries.push(userLanguageQuery)

    }

    await Promise.all(languageQueries)
    i18nDictionary.waitSignal(undefined)
  }

  getString(id: string, option?: any) {
    const bla = get(format);
    const str = bla(id, option);
    return str;
  }
}

