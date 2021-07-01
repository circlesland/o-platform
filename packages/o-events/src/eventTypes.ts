export type PlatformEventTypes =
    "shell.runProcess"
    | "shell.runProcessInShell"
    | "shell.showModal"
    | "shell.openModal"
    | "shell.begin"
    | "shell.progress"
    | "shell.done"
    | "shell.refresh"
    | "shell.navigateTo"
    | "shell.authenticated"
    | "shell.loggedOut"
    | "shell.gotProfile"
    | "shell.showNotification"
    | "shell.closeModal"
    | "shell.processStarted"
    | "circles.web3providerChanged"
    | "process.ready"
    | "process.nop"
    | "process.back"
    | "process.skip"
    | "process.shellEvent"
    | "process.requestShellEvent"
    | "process.continue"
    | "process.triggerSelf"
    | "process.cancel"
    | "process.cancelRequest"
    | "process.prompt"
    | "process.error"
    | "process.success"
    | "process.repeat"
    | "blockchain"
    | "signal.begin"
    | "signal.progress"
    | "signal.ready"
    | "signal.unavailable"

    //
    // IPC
    | "process.ipc.bubble" // used with 'sendParent' to bubble events up to the top
    | "process.ipc.sinker" // used with 'send' to sink down a result for a previously bubbled event

    //
    // USER-INTERACTION:

    // SELECTION:
    | "shell.interaction.selection.start"
    | "shell.interaction.selection.items.toggleSelected"
    | "shell.interaction.selection.cancel"
    | "shell.interaction.selection.finish"

    // MANIPULATION:
    | "shell.interaction.mutation.add"
    | "shell.interaction.mutation.selection.delete"

