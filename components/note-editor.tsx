import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface NoteEditorProps {
  value: string;
  onChange: (value: string) => void;
  reandOnly?: boolean;
}

export const NoteEditor = ({
  value,
  onChange,
  reandOnly = false,
}: NoteEditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `${
          reandOnly
            ? "h-auto"
            : "prose text-sm prose-sm m-4 focus:outline-none min-h-28"
        }`,
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !reandOnly,
    immediatelyRender: false,
  });

  return (
    <div className="rounded-base">
      <EditorContent
        editor={editor}
        className={cn(
          "bg-bg text-text text-sm",
          !reandOnly && "border border-border rounded-t-base "
        )}
      />
      {editor && !reandOnly ? <RichTextEditorToolbar editor={editor} /> : null}
    </div>
  );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="border border-border border-t-0 rounded-b-base flex items-center justify-between p-2 bg-bg">
      <div className="flex gap-2 items-center">
        <Button
          size="icon"
          className="size-7 text-sm"
          variant={editor.isActive("bold") ? "default" : "neutral"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="size-7 text-sm"
          variant={editor.isActive("italic") ? "default" : "neutral"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="size-7 text-sm"
          variant={editor.isActive("strike") ? "default" : "neutral"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 mx-2 bg-black" />
        <Button
          size="icon"
          className="size-7 text-sm"
          variant={editor.isActive("bulletList") ? "default" : "neutral"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="size-7 text-sm"
          variant={editor.isActive("orderedList") ? "default" : "neutral"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 items-center invisible sm:visible">
        <Button
          size="icon"
          variant="neutral"
          className="size-7 text-sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="neutral"
          className="size-7 text-sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
