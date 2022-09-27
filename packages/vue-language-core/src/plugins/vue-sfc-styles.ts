import { VueLanguagePlugin } from '../types';

const presetInitialIndentBrackets: Record<string, [string, string] | undefined> = {
	css: ['{', '}'],
	scss: ['{', '}'],
	less: ['{', '}'],
};

const plugin: VueLanguagePlugin = () => {

	return {

		getEmbeddedFileNames(fileName, sfc) {
			const names: string[] = [];
			for (let i = 0; i < sfc.styles.length; i++) {
				const style = sfc.styles[i];
				names.push(fileName + '.style_' + i + '.' + style.lang);
			}
			return names;
		},

		resolveEmbeddedFile(fileName, sfc, embeddedFile) {
			const match = embeddedFile.fileName.match(/^(.*)\.style_(\d+)\.([^.]+)$/);
			if (match) {
				const index = parseInt(match[2]);
				const style = sfc.styles[index];

				embeddedFile.capabilities = {
					diagnostics: true,
					foldingRanges: true,
					formatting: {
						initialIndentBracket: presetInitialIndentBrackets[style.lang],
					},
					documentSymbol: true,
					codeActions: true,
					inlayHints: true,
				};
				embeddedFile.appendContentFromSFCBlock(
					style,
					0,
					style.content.length,
					{
						hover: true,
						references: true,
						definitions: true,
						diagnostic: true,
						rename: true,
						completion: true,
						semanticTokens: true,
					},
				);
			}
		},
	};
};
export = plugin;
