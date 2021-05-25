import {createAvatar} from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export class AvataarGenerator {
    public static generate(seed:string) {
        if (!seed || seed.trim() == "") {
            return this.default();
        }

        if (seed.startsWith("0x") && RpcGateway.get().utils.isAddress(seed)) {
            seed = RpcGateway.get().utils.toChecksumAddress(seed);
        }

        const svg = createAvatar(style, {
            seed: seed,
            // backgroundColor: "#65C9FF",
            topChance: 100,
            mouth: [
                "default",
                "eating",
                "serious",
                "smile",
                "tongue",
                "twinkle",
            ],
            eyes: [
                "close",
                "closed",
                "default",
                "roll",
                "eyeRoll",
                "happy",
                "hearts",
                "side",
                "squint",
                "surprised",
                "wink",
                "winkWacky",
            ],
            eyebrow: [
                "default" ,
                "defaultNatural" ,
                "flat" ,
                "flatNatural" ,
                "raised" ,
                "raisedExcited" ,
                "raisedExcitedNatural" ,
                "unibrow" ,
                "unibrowNatural" ,
                "up" ,
                "upDownNatural" ,
            ],
            style: "transparent",
            dataUri: true,
        });
        return svg;
    }

    public static default() {
        const svg = createAvatar(style, {
            seed: "default",
            // backgroundColor: "#65C9FF",
            topChance: 100,
            accessoriesChance: 0,
            facialHairChance: 0,
            top: ["shortHair"],
            hatColor: ["gray"],
            hairColor: ["gray"],
            clothes: ["hoodie"],
            clothesColor: ["gray"],
            eyes: ["default"],
            eyebrow: ["defaultNatural"],
            mouth: ["default"],
            skin: ["pale"],
            style: "transparent",
            dataUri: true,
        });
        return svg;
    }
}