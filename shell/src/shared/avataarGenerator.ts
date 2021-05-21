import {createAvatar} from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";

export class AvataarGenerator {
    public static generate(seed:string) {
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
            style: "transparent",
            dataUri: true,
        });
        return svg;
    }

    public static boring() {
        const svg = createAvatar(style, {
            seed: "boring",
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