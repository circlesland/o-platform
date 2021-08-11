<script lang="ts">
    import * as bip39 from "bip39";
    import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
    import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";

    let seedphrase: string;
    let safeAddress: string;

    async function findSafeDeployments(address?: string) {
        const checksumAddress = RpcGateway.get().utils.toChecksumAddress(address);

        const addr = [
            "0xDE374ece6fA50e781E81Aac78e811b33D16912c7",
            "0xC4f05F63A9498568435c1D43ab75c8Fbd7e4a392",
            "0x7D61cFB0C21Dabd7B664502aa63Aa98487d67F5B",
            "0xf18AB992e0f96f3bC3e8B951Fc27Fd6318F5C8F7",
            "0x5D8a0B427a3BcB9202790E96AEB26706851CaC15",
            "0x009626dAdEd5E90aECee30AD3EBf2b3E510FE256",
            "0x983756871568faa9C6654018d39Dbf803967ec29",
            "0xC816d35b511bbBD647a063ef521bA12242C7F4B5",
            "0x9B74661e83F6696AdF872576f886Dc5Eb569B0bD",
            "0x3bAda513ABFa05B45b520b0e7E75955DF504B35f",
            "0x580816b8bEb4D1bca5b48Af07Cd989b6fFed6904",
            "0x860e453D8248F20b1b0D7f08BAccC92C16A09F7F"
        ];

        const owners = await Promise.all(addr.map(async add => {
            try {
                const owners = await new GnosisSafeProxy(RpcGateway.get(), add).getOwners();
                const ownerAddresses = owners.map(o => RpcGateway.get().utils.toChecksumAddress(o));
                return {
                    address: add,
                    owners: ownerAddresses,
                    error: undefined
                };
            }
            catch(e)
            {
                return {
                    address: undefined,
                    owners: undefined,
                    error: e
                };
            }
        }));

        const yourSafe = owners.filter(o => o.owners ? o.owners.indexOf(checksumAddress) >= 0 :  false);
        if (yourSafe.length > 0) {
            safeAddress = yourSafe[0].address;
        } else {
            safeAddress = "Couldn't find the address";
        }
    }

    async function recover() {
        const key = bip39.mnemonicToEntropy(seedphrase);
        const acc = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
        const accAddr = acc.address;

        const mySafe = await findSafeDeployments(accAddr);
        // console.log(mySafe);
    }
</script>
Use this page to recover your safe address from your seedphrase.<br/>
Seedphrase: <input type="text" bind:value={seedphrase}/><br/>
<button class="btn btn-primary" on:click={recover}>Recover</button><br/>
<b>
    {!safeAddress ? "" : safeAddress}
</b>