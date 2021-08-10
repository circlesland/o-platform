<script lang="ts">
    export let isOpen: boolean;

    let component: any;
    let params: {[x:string]: any};

    export function load(component:any, params:{[x:string]: any}) {
        component = component;
        params = params;
    }

    export function open() {
        if (!component)
            throw new Error(`No 'component' was set. Cannot open the dialog. Please call 'load()' first and set at least a component.`)

        isOpen = true;
    }

    export function close() {
        isOpen = false;
    }
</script>
Open: {isOpen}