import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import {StateSchema, StatesConfig} from "xstate";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {uploadFile} from "./uploadFile";
import {normalizePromptField, prompt, PromptField} from "@o-platform/o-process/dist/states/prompt";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import PicturePreview from "@o-platform/o-editors/src/PicturePreview.svelte";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import {Generate} from "@o-platform/o-utils/dist/generate";

const strings = {
  labelFile: (context:ProcessContext<any>) => `labelFile`,
};

type UploadPictureSpec<TContext extends ProcessContext<any>> = {
  id?:string;
  field: PromptField<TContext>;
  isOptional: boolean,
  next: string,
  skipIfNotDirty?: boolean,
  previous?: string
}

export function promptFile<
    TContext extends ProcessContext<any>,
    TEvent extends PlatformEvent
    >(spec: UploadPictureSpec<TContext>) {
  spec.id = spec.id ? spec.id : Generate.randomHexString(4)
  const generatedId = Generate.randomHexString(4);
  const id = (x:string) => `${spec.id}/${generatedId}/${x}`;
  const editDataFieldConfig: StatesConfig<TContext, StateSchema, TEvent> = <any>{
    id: spec.id,
    initial: "checkPreviewFile",
    states: {
      checkPreviewFile: {
        id: id("checkPreviewFile"),
        entry: () => console.log(`checkPreviewFile entry`),
        always: [{
          cond: (context) => {
            const field = normalizePromptField(spec.field);
            return !!context.data[field.name];
          },
          target: `#${id("previewFile")}`
        }, {
          target: `#${id("checkEditFile")}`
        }],
      },
      previewFile: prompt<TContext, any>({
        id: id("previewFile"),
        entry: () => console.log(`previewFile entry`),
        field: spec.field,
        onlyWhenDirty: spec.skipIfNotDirty,
        component: PicturePreview,
        params: {
          label: strings.labelFile,
          submitButtonText: "Save",
        },
        navigation: {
          next: `#${id("checkEditFile")}`,
          canGoBack: () => !!spec.previous,
          previous: spec.previous,
          canSkip: () => spec.isOptional,
          skip: spec.next
        },
      }),
      checkEditFile: {
        id: id("checkEditFile"),
        entry: () => console.log(`checkEditFile entry`),
        always: [{
          cond: (context) => {
            const field = normalizePromptField(spec.field);
            return !context.data[field.name];
          },
          actions: (context) => {
            const field = normalizePromptField(spec.field);
            delete context.dirtyFlags[field.name];
            context.dirtyFlags["file"] = true;
            context.data.file = undefined;
          },
          target: `#${id("editFile")}`,
        }, {
          target: spec.next,
        }],
      },
      editFile: prompt<TContext, any>({
        id: id("editFile"),
        entry: () => console.log(`editFile entry`),
        field: "file",
        onlyWhenDirty: spec.skipIfNotDirty,
        component: PictureEditor,
        params: {
          label: strings.labelFile,
          submitButtonText: "Save Image",
        },
        navigation: {
          next: `#${id("uploadOrSkip")}`,
          previous: spec.previous,
          canSkip: () => true,
        },
      }),
      uploadOrSkip: {
        id: id("uploadOrSkip"),
        entry: () => console.log(`uploadOrSkip entry`),
        always: [
          {
            cond: (context) => {
              return (
                  context.dirtyFlags["file"] &&
                  !!context.data.file &&
                  !!context.data.file.bytes
              );
            },
            target: `#${id("uploadFile")}`,
          },
          {
            cond: () => spec.isOptional,
            target: spec.next,
          },
          {
            actions: (context: TContext) => {
              const field = normalizePromptField(spec.field);
              context.messages[field.name] = `Please specify a valid file.`;
            },
            target: `#${id("checkPreviewFile")}`
          }
        ],
      },
      uploadFile: {
        id: id("uploadFile"),
        on: {
          ...(<any>ipc(id("uploadFile"))),
        },
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Uploading your file ..`
          });
        },
        invoke: {
          src: uploadFile.stateMachine(id("uploadFile")),
          data: {
            data: (context, event) => {
              return {
                appId: "__FILES_APP_ID__",
                fileName: context.data.fileName ?? "",
                mimeType: context.data.file.mimeType,
                bytes: context.data.file.bytes,
              };
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: [
            {
              cond: (context, event) => event.data instanceof Error,
              target: "errorUploadingFile",
            },
            {
              target: spec.next,
            },
          ],
          onError: "errorUploadingFile",
        },
      },
      errorUploadingFile: prompt<TContext, any>({
        field: "errorUploadingFile",
        entry: (context) => {
          context.data.errorUploadingFile = `
          <b>Oops.</b><br/>
          We couldn't upload your file.<br/>
          <br/>
          Please make sure that your file doesn't exceed the maximum allowed file size of 4 MB.<br/>
          Either choose a different file or skip it for now.
        `;
          const field = normalizePromptField(spec.field);
          context.dirtyFlags[field.name] = true;
        },
        component: HtmlViewer,
        isSensitive: true,
        params: {
          submitButtonText: "Try again",
          html: (context) => context.data.errorUploadingFile
        },
        navigation: {
          next: `#${id("checkPreviewFile")}`
        },
      })
    }
  };
  return editDataFieldConfig;
}