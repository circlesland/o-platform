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
  labelFile: `Please select a file to upload`,
};

type UploadPictureSpec<TContext extends ProcessContext<any>> = {
  id?:string;
  field: PromptField<TContext>;
  skipIfNotDirty?: boolean,
  params?: {
    label: string
  },
  navigation: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
        context: ProcessContext<TContext>,
        event: { type: string; [x: string]: any }
    ) => boolean;
    next: string;
    skip?: string;
    canSkip?: (
        context: ProcessContext<TContext>,
        event: { type: string; [x: string]: any }
    ) => boolean;
  };
}

export function promptFile<
    TContext extends ProcessContext<any>,
    TEvent extends PlatformEvent
    >(spec: UploadPictureSpec<TContext>) {

  // This variable will be used to back the 'file' value which
  // usually would be on context.data.file but the
  // PromptField's behaviour is overridden so that it uses
  // this field instead (see 'editFile'.'field' for details).
  let file: {
    mimeType:string;
    fileName: string;
    bytes: Buffer;
  };

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
          label: spec.params?.label ?? strings.labelFile,
          submitButtonText: "Save",
        },
        navigation: {
          next: `#${id("checkEditFile")}`,
          canGoBack: () => !!spec.navigation.previous,
          previous: spec.navigation.previous,
          canSkip: spec.navigation.canSkip,
          skip: spec.navigation.next
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
          target: spec.navigation.next,
        }],
      },
      editFile: prompt<TContext, any>({
        id: id("editFile"),
        entry: () => console.log(`editFile entry`),
        field: {
          name: "file",
          get: () => {
            // TODO: The contents could be loaded from the 'url' but in the current flow its not necessary
            return file ?? {};
          },
          set: (o) => {
            console.log("Setting 'file' to:", o);
            file = o;
          }
        },
        onlyWhenDirty: spec.skipIfNotDirty,
        component: PictureEditor,
        params: {
          label: spec.params?.label ?? strings.labelFile,
          submitButtonText: "Save Image",
        },
        navigation: {
          next: `#${id("uploadOrSkip")}`,
          previous: spec.navigation.previous,
          canSkip: spec.navigation.canSkip,
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
                  !!file &&
                  !!file.bytes
              );
            },
            target: `#${id("uploadFile")}`,
          },
          {
            cond: spec.navigation.canSkip,
            target: spec.navigation.next,
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
                fileName: file.fileName ?? "",
                mimeType: file.mimeType,
                bytes: file.bytes,
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
              target: spec.navigation.next,
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