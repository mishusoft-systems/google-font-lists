declare class GoogleFont {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: {
        [key: string]: string;
    };
    category: string;
    kind: string;
}

declare type OptionDisplayFont = "yes" | "no";
declare type OptionVariant = "all" | string;

declare type Options = {
    "defaults": object,
    "format": object[],
    "include": {
        "display_font": OptionDisplayFont,
        "variant": OptionVariant,
        "subsets": string | [],
        "lastModified": string
    },
    "transform": {
        "regular": string,
        "regularItalic": string
        "italic": string,
    }
}