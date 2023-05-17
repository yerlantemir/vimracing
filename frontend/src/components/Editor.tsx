import {
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  ViewUpdate
} from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { Text } from '@codemirror/state';

import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { DirectMergeConfig, unifiedMergeView } from '@codemirror/merge';
import { EditorView } from 'codemirror';

type EditorConfig = Partial<DirectMergeConfig> & {
  onChange: (doc: string[]) => void;
  raceDoc: { start: string[]; target: string[] };
};

class Editor extends EditorView {
  constructor(config?: EditorConfig) {
    super({
      doc: Text.of(config?.raceDoc.start ?? []),
      parent: config?.parent,
      extensions: [
        vim(),
        lineNumbers(),
        javascript(),
        keymap.of([...defaultKeymap, indentWithTab]),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        highlightActiveLine(),
        dropCursor(),
        rectangularSelection(),
        drawSelection(),
        oneDark,
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            console.log(v.state);

            config?.onChange?.(v.state.doc.toJSON());
          }
        }),
        ...unifiedMergeView({
          mergeControls: false,
          original: Text.of(config?.raceDoc.target ?? [])
        })
      ]
    });
  }
}
export default Editor;
