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
import { Text } from '@codemirror/state';

import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { MergeView, DirectMergeConfig } from '@codemirror/merge';
import { EditorView } from 'codemirror';

type EditorConfig = Partial<DirectMergeConfig> & {
  onChange: (doc: string[]) => void;
  raceDoc: { start: string[]; goal: string[] };
};

const createDefaultConfig = (config?: EditorConfig) => ({
  a: {
    doc: Text.of(config?.raceDoc.start ?? []),
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
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          console.log(v.state);

          config?.onChange?.(v.state.doc.toJSON());
        }
      })
    ]
  },
  b: {
    doc: Text.of(config?.raceDoc?.goal ?? []),
    extensions: [
      lineNumbers(),
      javascript(),
      EditorView.theme({
        '&': {
          pointerEvents: 'none',
          userSelect: 'none'
        }
      }),
      EditorView.editable.of(false)
    ]
  },
  highlightChanges: true,
  gutter: true
});
class Editor extends MergeView {
  constructor(config?: EditorConfig) {
    super({ ...createDefaultConfig(config), ...config });
  }
}
export default Editor;
