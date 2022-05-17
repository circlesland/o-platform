<script lang="ts">
  import Ajv from "ajv";
  import {createEventDispatcher, onMount} from "svelte";

  const ajv = new Ajv({
  coerceTypes: true,
  strict: false
});

export let jsonSchema:string;
$:schema = jsonSchema ? JSON.parse(jsonSchema) : undefined;

export let value:object;

export let error:any;

let validate:any;
const dispatcher = createEventDispatcher();

function setPropertyAtPath(obj:any, path:string, value:any) {
  const keys = path.split(".")
    .filter(o => o.trim() != "");

  let currentObj = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i == keys.length - 1) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj[key] = value;
    } else {
      currentObj = currentObj[key];
    }
  }
}

type ObjectVisitor = {
  visitProperty(path:string, propertyName:string, propertyNode:any) : void
};

function walkSchema(path:string, schemaNode:any, visistor: ObjectVisitor) {
  for (const propertyName of Object.keys(schemaNode.properties ?? {})) {
    const propertyNode = schemaNode.properties[propertyName];
    const propertyPath = path + "." + propertyName;

    walkSchema(propertyPath, propertyNode, visistor);

    visistor.visitProperty(propertyPath, propertyName, propertyNode);
  }
}

function walkObject(path:string, node:any, visitor: ObjectVisitor) {
  for(const propertyName of  (typeof node == "object") ? Object.keys(node) : []) {
    const propertyValue = node[propertyName];
    const propertyPath = path + "." + propertyName;

    walkObject(propertyPath, propertyValue, visitor);

    visitor.visitProperty(propertyPath, propertyName, propertyValue);
  }
}

function getFormData(schemaNode:any) {
  const editorObject = {};

  walkSchema("", schemaNode, {
    visitProperty(path: string, propertyName: string, propertyValue: any) {
      setPropertyAtPath(editorObject, path, propertyValue.__value);
    }
  });

  const validationResult = validate(editorObject);

  return {
    editorObject,
    isValid: validationResult,
    errors: validate.errors
  };
}

function setFormData(schemaNode:any, editorObject:any) {
  walkObject("", editorObject, {
    visitProperty(path: string, propertyName: string, propertyValue: any) {
      const schemaPath = path.split(".")
        .filter(o => o.trim() !== "")
        .map(o => `properties.${o}`)
        .join(".") + ".__value";

      console.log("schemaPath:", schemaPath);
      setPropertyAtPath(schemaNode, schemaPath, propertyValue);
    }
  });

  const validationResult = validate(editorObject);

  return {
    editorObject,
    isValid: validationResult,
    errors: validate.errors
  };
}

onMount(() => {
  validate = ajv.compile(schema);
  setFormData(schema, value);
  const result = getFormData(schema);
  error = result.errors;
});

</script>
<h1>{schema.title}</h1>
{#if error}
    {#each error as e}
        <h2>{e.instancePath.substring(1)} {e.message}</h2>
    {/each}
{/if}
{#each Object.entries(schema.properties) as [property, value]}
    {#if value.title}
        <h2>{value.title}</h2>
    {/if}
    {#if value.enum && Array.isArray(value.enum) && value.type !== "array"}
        <select class="w-full max-w-xs select select-lg select-bordered"
                bind:value="{value.__value}"
                on:change={() => {
                    const formData = getFormData(schema);
                    if (formData.isValid) {
                        value = formData.editorObject;
                        dispatcher("value", formData.editorObject);
                        error = undefined;
                    } else {
                        error = formData.errors;
                    }
                }}
                class:select-error="{false}">
            {#if value.placeholder}
                <option value="" disabled selected>{value.placeholder}</option>
            {/if}
            {#each value.enum as option}
                <option value="{option}">{option}</option>
            {/each}
        </select>
    {/if}
{/each}

