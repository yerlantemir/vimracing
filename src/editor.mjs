import { EditorView } from "codemirror";
import {
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
} from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { Vim, vim } from "@replit/codemirror-vim";
import { javascript } from "@codemirror/lang-javascript";
import { MergeView } from "@codemirror/merge";

const doc1 = `
  if (true) {
    console.log(hello);
  }
  else {
    console.log(fuck you!)
  }
`;
const doc2 = `
  if (false) {
    console.log(hello);
  }
  else {
    console.log('fuck you!')
  }
`;

new MergeView({
  a: {
    doc: doc1,
    extensions: [
      vim(),
      lineNumbers(),
      javascript(),
      keymap.of([defaultKeymap, indentWithTab]),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      highlightActiveLine(),
      dropCursor(),
      rectangularSelection(),
      drawSelection(),
    ],
  },
  b: {
    doc: doc2,
    extensions: [lineNumbers(), javascript()],
  },
  parent: document.body,
  highlightChanges: true,
  gutter: true,
});
