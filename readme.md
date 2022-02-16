# shell-dapp-starter template

## Quickstart

```shell
# Checkout
git clone https://github.com/circlesland/o-platform.git

# Build
cd o-platform
./build.sh

# Run
cd shell
npm run dev

#Build & Run with local self-signed Certificate:
cd o-platfrom
./buildlocal.shrink-0

cd shell
npm run devs

```

## Building blocks

### Shell

The shell is a svelte application which responsibility it is to load Dapps (by route) and run processes that require user interaction.
Loaded dapps can use the shell to communicate with each other using events.

#### Loader

The loader can be found in _/shell/src/libs/shell-os/loader.ts:_.
It 'import's all dapp manifests at the beginning of the file and then
calls 'constructRoutes()'. It exports the constructed routes via it's 'routes'-const. These routes are then hooked up to the svelte-spa-router.

On every invocation of a route, the loader's 'getDappEntryPoint()' function is called
with the invoked dapp- and pageManifest. It returns a configured svelte component that can be displayed
by the <Router> component in App.svelte.

### Dapps

A Dapp is a small application that consists of pages, other svelte components and processes.  
Every Dapp has a [DappManifest](https://github.com/circlesland/o-dapp-starter/blob/master/packages/omo-kernel-interfaces/src/dappManifest.ts) file which lists all
[PageManifests](https://github.com/circlesland/o-dapp-starter/blob/master/packages/omo-kernel-interfaces/src/pageManifest.ts).

### Pages

Each Dapp has one or more page(s).

### Processes
