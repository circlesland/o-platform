import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {
  normalizePromptField,
  prompt,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import { DropdownSelectorParams } from "@o-platform/o-editors/src/DropdownSelectEditorContext";
import DropDownCity from "@o-platform/o-editors/src/dropdownItems/DropDownCity.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import {
  CitiesByIdDocument,
  CitiesByIdQueryVariables,
  CitiesByNameDocument,
  CitiesByNameQueryVariables,
  City
} from "./data/types";
import {ApiClient} from "../apiConnection";

const resultData = {
  "suggestions": [
    {
      "label": "Philippines, Las Piñas, Aventine Hls",
      "language": "en",
      "countryCode": "PHL",
      "locationId": "NT_9vp8t1rcp.Q6XoKefc0iRB",
      "address": {
        "country": "Philippines",
        "state": "National Capital Region",
        "county": "Fourth District NCR",
        "city": "Las Piñas",
        "district": "Talon Dos",
        "street": "Aventine Hls",
        "postalCode": "1747"
      },
      "matchLevel": "street"
    },
    {
      "label": "United States, TN, Chattanooga, Aventine Way",
      "language": "en",
      "countryCode": "USA",
      "locationId": "NT_acJZp1qE-0SZtt6v42B3TB",
      "address": {
        "country": "United States",
        "state": "TN",
        "county": "Hamilton",
        "city": "Chattanooga",
        "street": "Aventine Way",
        "postalCode": "37421"
      },
      "matchLevel": "street"
    },
    {
      "label": "Deutschland, Abensberg, Aventinusplatz",
      "language": "de",
      "countryCode": "DEU",
      "locationId": "NT_wTEqY4WWe5jeOYqP5rdPnC",
      "address": {
        "country": "Deutschland",
        "state": "Bayern",
        "county": "Kelheim",
        "city": "Abensberg",
        "district": "Abensberg",
        "street": "Aventinusplatz",
        "postalCode": "93326"
      },
      "matchLevel": "street"
    },
    {
      "label": "Deutschland, München, Aventinstraße",
      "language": "de",
      "countryCode": "DEU",
      "locationId": "NT_bIvv3frWnRJXSkGKGeyDyA",
      "address": {
        "country": "Deutschland",
        "state": "Bayern",
        "county": "München (Stadt)",
        "city": "München",
        "district": "Isarvorstadt",
        "street": "Aventinstraße",
        "postalCode": "80469"
      },
      "matchLevel": "street"
    },
    {
      "label": "United States, FL, Jacksonville, Aventine at Town Center",
      "language": "en",
      "countryCode": "USA",
      "locationId": "NT_8ytyPsZ3i-H8TaehyW7LAA",
      "address": {
        "country": "United States",
        "state": "FL",
        "county": "Duval",
        "city": "Jacksonville",
        "district": "Windy Hill",
        "street": "Aventine at Town Center",
        "postalCode": "32246"
      },
      "matchLevel": "street"
    }
  ]
};

const AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json';
const APIKEY = "fhiIkoASi1B-z8R7ytKBnfJltOpaUlYBV1kydXyK1sE";

async function search(text:string, isAddress?: boolean) {
  const params = '?' +
    'query=' +  encodeURIComponent(text) +   // The search text which is the basis of the query
    '&beginHighlight=' + encodeURIComponent('<mark>') + //  Mark the beginning of the match in a token.
    '&endHighlight=' + encodeURIComponent('</mark>') + //  Mark the end of the match in a token.
    '&maxresults=5' +  // The upper limit the for number of suggestions to be included
    // in the response.  Default is set to 5.
    '&resultType=city' +
    '&apikey=' + encodeURIComponent(APIKEY);

  const url = AUTOCOMPLETION_URL + params;

  const response = await fetch(url);
  const json = await response.json();

  console.log(json);
  return json;
}

async function loadById(locationId:string) : Promise<any> {
  const url = `https://geocoder.ls.hereapi.com/6.2/geocode.json?locationid=${encodeURIComponent(locationId)}&jsonattributes=1&gen=9&apiKey=${encodeURIComponent(APIKEY)}`;
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  return json;
}

export function promptCity<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: {
  id?: string;
  field: PromptField<TContext>;
  params: {
    view: EditorViewContext;
    [x: string]: any;
  };
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
    next?: string;
    skip?: string;
    canSkip?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
  };
}) {
  const field = normalizePromptField(spec.field);

  return prompt<TContext, any>({
    id: spec.id ?? field.name,
    field: spec.field,
    component: DropdownSelectEditor,
    params: <DropdownSelectorParams<TContext, City, number>>{
      view: spec.params.view,
      placeholder: spec.params.view.placeholder,
      submitButtonText: spec.params.view.submitButtonText,
      itemTemplate: DropDownCity,
      getKey: (o) => o.geonameid,
      getLabel: (o) => `${o.name} (${o.country})`,
      keyProperty: "geonameid",
      choices: {
        byKey: async (locationId: number) => {
          const result = await loadById(locationId.toString());
          console.log("GetByIdResult:", result);

          return !result.response?.view?.length
            ? undefined
            : result.response.view[0];
        },
        find: async (filter: string) => {
          const n = <any>navigator;
          const lang = n.language || n.userLanguage;

          console.log("Search string:", filter)
          const result = (await search(filter)).suggestions.map(o => {
            return {
              geonameid: o.locationId,
              name: o.label,
              country: o.address?.country,
              population: 0,
              latitude: 0,
              longitude: 0,
              feature_code: ""
            };
          });

          return result.length
            ? result.reverse()
            : [];
        },
      },
    },
    navigation: spec.navigation,
  });
}
