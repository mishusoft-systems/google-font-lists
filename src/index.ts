// // External dependencies
import path from "node:path";

// Internal dependencies
import {createSingleObject, loadJsonFile, verifyPath, verifyPathOrCreate, writeFile} from "./utils";

export default (Options: Options | null) => {
    try {
        let OperationOptions: any = {};
        const UTF_8: any = {encoding: 'utf-8'};

        if (!!Options) {
            OperationOptions = Options;
        } else if (verifyPath(path.resolve(process.cwd(), "./package.json"))) {
            const userPackageOptions = loadJsonFile(path.resolve(process.cwd(), "./package.json"), UTF_8);
            if (Object(userPackageOptions).hasOwnProperty('config')
                && Object(userPackageOptions.config).hasOwnProperty('google-font-lists')) {
                OperationOptions = userPackageOptions.config['google-font-lists'];
            }
        }

        const defaultPackageJson = path.resolve(__dirname, "./../package.json");
        const userPackageJsonObject = loadJsonFile(defaultPackageJson, UTF_8);
        OperationOptions = {...OperationOptions, ...userPackageJsonObject.config['google-font-lists']};

        const outputPath = path.resolve(process.cwd(), "./dist");
        const currentFontFamiliesFilePath = path.join(outputPath, `/font-families.json`);

        const googleFontsJson = path.resolve(__dirname, "./../data/google-fonts.json");
        const GoogleFonts = loadJsonFile(googleFontsJson, UTF_8);
        const googleFontList: any = [];
        let availableFonts = GoogleFonts.items;

        if (OperationOptions.hasOwnProperty('defaults') && OperationOptions.defaults.length) {
            googleFontList.push(OperationOptions.defaults);
        }

        if (OperationOptions.include.variant !== 'all'
            && typeof Number.parseInt(OperationOptions.include.variant as string) === 'number') {
            availableFonts = [].filter.call(availableFonts, (googleFont: GoogleFont) => {
                return googleFont.variants.length >= OperationOptions.include.variant;
            });
        }

        if (OperationOptions.include.display_font === 'no') {
            availableFonts = [].filter.call(availableFonts, (googleFont: GoogleFont) => {
                return googleFont.category !== 'display';
            });
        }

        if (typeof OperationOptions.include.subsets === 'string') {
            availableFonts = [].filter.call(availableFonts, (googleFont: GoogleFont) => {
                return googleFont.subsets.includes(OperationOptions.include.subsets);
            });
        }

        if (typeof OperationOptions.include.subsets === "object") {
            availableFonts = [].filter.call(availableFonts, (googleFont: GoogleFont) => {
                return [].filter.call(googleFont.subsets, (subset: string) => {
                    return OperationOptions.include.subsets.includes(subset);
                })
            });
        }

        if (OperationOptions.include.hasOwnProperty('lastModified')) {
            availableFonts = [].filter.call(availableFonts, (googleFont: GoogleFont) => {
                return [].filter.call(googleFont.subsets, (subset: string) => {
                    return OperationOptions.include.subsets.includes(subset);
                })
            });
        }

        // Query with Google fonts
        [].map.call(availableFonts, (googleFont: GoogleFont | any) => {
            const formatListedFontElements = function (format: { label: string, data: string }): any {
                if (format.data === 'variants') {
                    const regex = new RegExp('italic', "g");
                    return {
                        label: format.label,
                        data: [].map.call(
                            googleFont.variants,
                            function (variant: string) {
                                if (variant === 'regular') return OperationOptions.transform.regular;
                                else if (variant === 'italic') return OperationOptions.transform.regularItalic;
                                else if (regex.test(variant)) return variant.replace(regex, ` {OperationOptions.transform.italic}`);
                                else return variant;
                            })
                    }
                }


                return {
                    label: format.label,
                    data: googleFont[format.data]
                }
            };
            googleFontList.push(createSingleObject([].map.call(OperationOptions.format, formatListedFontElements) as any));
        });

        verifyPathOrCreate(path.dirname(currentFontFamiliesFilePath), {recursive: true});
        writeFile(currentFontFamiliesFilePath, JSON.stringify(googleFontList));
        console.log(`Google font families list generated.`);
    } catch (err) {
        console.error(err);
    }
}