import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  ViewUpdate,
  EditorView
} from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicLight } from 'cm6-theme-basic-light';
import { Text } from '@codemirror/state';
import {
  defaultKeymap,
  historyKeymap,
  indentWithTab,
  history
} from '@codemirror/commands';
import { vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { DirectMergeConfig, unifiedMergeView } from '@codemirror/merge';
import { Theme } from './context/ThemeContext';

type EditorConfig = Partial<DirectMergeConfig> & {
  onChange?: (doc: string[]) => void;
  raceDoc: { start: string[]; target: string[] };
  readOnly?: boolean;
  theme: Theme;
};

class Editor extends EditorView {
  constructor(config?: EditorConfig) {
    super({
      doc: Text.of(config?.raceDoc.start ?? []),
      parent: config?.parent,
      extensions: [
        vim(),
        history(),
        javascript(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        highlightSpecialChars(),
        dropCursor(),
        rectangularSelection(),
        drawSelection(),
        config?.theme === 'light' ? basicLight : oneDark,
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            config?.onChange?.(v.state.doc.toJSON());
          }
        }),
        ...unifiedMergeView({
          mergeControls: false,
          original: Text.of(config?.raceDoc.target ?? [])
        }),
        EditorView.editable.of(!config?.readOnly)
      ]
    });
  }
}
export default Editor;

export const isTextEqual = (a: string[], b: string[]) => {
  return Text.of(a).eq(Text.of(b));
};
