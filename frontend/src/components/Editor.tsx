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
import {
  DirectMergeConfig,
  unifiedMergeView,
  MergeView
} from '@codemirror/merge';
import { ThemeContext } from './context/ThemeContext';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { Theme } from '@/types/Theme';
import { RaceDocs } from '@vimracing/shared';

type EditorConfig = Partial<DirectMergeConfig> & {
  onChange?: (doc: string[]) => void;
  raceDoc: RaceDocs[number];
  readOnly?: boolean;
  theme: Theme;
};

const HORIZONTAL_CHARACTERS_LIMIT = 50;

const sharedExtension = (config?: EditorConfig) => [
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
  EditorView.editable.of(!config?.readOnly)
];

const createDefaultMergeViewConfig = (config?: EditorConfig) => ({
  a: {
    doc: Text.of(config?.raceDoc.start ?? []),
    extensions: [...sharedExtension(config)]
  },
  b: {
    doc: Text.of(config?.raceDoc?.target ?? []),
    extensions: [
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

class MergeViewEditor extends MergeView {
  constructor(config?: EditorConfig) {
    super({ ...createDefaultMergeViewConfig(config), ...config });
  }
}

class UnifiedMergeViewEditor extends EditorView {
  constructor(config?: EditorConfig) {
    super({
      doc: Text.of(config?.raceDoc.start ?? []),
      parent: config?.parent,
      extensions: [
        ...sharedExtension(config),
        ...unifiedMergeView({
          mergeControls: false,
          original: Text.of(config?.raceDoc.target ?? [])
        }),
        EditorView.editable.of(!config?.readOnly)
      ]
    });
  }
}

export const isTextEqual = (a: string[], b: string[]) => {
  return Text.of(a).eq(Text.of(b));
};

export const Editor: React.FC<Omit<EditorConfig, 'parent' | 'theme'>> = ({
  onChange,
  raceDoc,
  readOnly
}) => {
  const editorParentElement = useRef<HTMLDivElement | null>(null);

  const { theme } = useContext(ThemeContext);

  const shouldRenderVertically = useMemo(() => {
    return (
      raceDoc.start.some((line) => line.length > HORIZONTAL_CHARACTERS_LIMIT) ||
      raceDoc.target.some((line) => line.length > HORIZONTAL_CHARACTERS_LIMIT)
    );
  }, [raceDoc.start, raceDoc.target]);

  useEffect(() => {
    if (
      !editorParentElement.current ||
      editorParentElement.current.childNodes.length !== 0
    )
      return;
    const editorCreateConfig = {
      raceDoc,
      parent: editorParentElement.current,
      onChange,
      theme,
      readOnly
    };

    const shouldBeUnified = !raceDoc.source.includes('vimgolf');
    const editor = shouldBeUnified
      ? new UnifiedMergeViewEditor(editorCreateConfig)
      : new MergeViewEditor(editorCreateConfig);

    if (shouldBeUnified) (editor as UnifiedMergeViewEditor).focus();
    else {
      (editor as MergeViewEditor).a.focus();
    }

    // hack
    if (shouldRenderVertically) {
      editorParentElement.current
        .querySelectorAll('.cm-mergeViewEditor')
        .forEach((el, index) => {
          if (index === 0) {
            el.setAttribute(
              'style',
              'flex-basis: auto; border-top: 1px solid var(--color-text)'
            );
          } else {
            el.setAttribute('style', 'flex-basis: auto');
          }
        });
      editorParentElement.current
        .querySelector('.cm-mergeViewEditors')
        ?.setAttribute('style', 'flex-direction: column-reverse');
    }

    return () => {
      editor.destroy();
    };
  }, [onChange, raceDoc, readOnly, shouldRenderVertically, theme]);

  return <div ref={editorParentElement} />;
};
