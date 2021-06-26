/**
 * This class runs exactly one root-actor which can be asked
 * to spawn a new process.
 * All (running) processes are stored in an array on the context.
 *
 * The class was created mainly to resolve the issue of navigating
 * between different processes (one process starts another and then the user
 * wants to use the back-button to go back to the previous process).
 *
 * To resolve the issue, the ProcessManager tracks the source of the process-creation
 * which can be either 'unknown' (for root processes) or a process-id (which
 * is randomly generated for every new process).
 * This way we can keep all predecessor-processes running until the last of the
 * processes stopped.
 *
 * To realize this functionality, the ProcessManager intercepts all events from-
 * and to the process. When it intercepts a "process.back" event and knows (how does it know?)
 * that this back-event exceeds the process' own states, then it looks for a preceding
 * process. If it finds one it recalls it's last (interactive) step (only a prompt suits) and
 * presents it to the user.
 *
 */
/*
 * The ProcessManager must also keep track of all initial and final Contexts.
 * All processes
 */
export class ProcessManager {

}