"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Underline } from "@tiptap/extension-underline";
import { Mark, mergeAttributes } from "@tiptap/core";
import { useEffect } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Sparkles, X } from "lucide-react";

// ── Custom mark: visual accent effect ──
const AccentEffect = Mark.create({
  name: "accentEffect",
  priority: 1001,
  addAttributes() {
    return { effect: { default: "gradient" } };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-accent-effect]",
        getAttrs: (el: HTMLElement) => ({ effect: el.getAttribute("data-accent-effect") }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ["span", mergeAttributes({ "data-accent-effect": HTMLAttributes.effect }), 0];
  },
  inclusive: false,
});

// ── Custom mark: text size presets ──
const TextSize = Mark.create({
  name: "textSize",
  addAttributes() {
    return { size: { default: "normal" } };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-size]",
        getAttrs: (el: HTMLElement) => ({ size: el.getAttribute("data-size") }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    const sizeMap: Record<string, string> = {
      small: "0.75em",
      large: "1.3em",
      display: "1.65em",
    };
    const fs = sizeMap[HTMLAttributes.size as string];
    return [
      "span",
      mergeAttributes(
        { "data-size": HTMLAttributes.size },
        fs ? { style: `font-size: ${fs}` } : {}
      ),
      0,
    ];
  },
  inclusive: false,
});

// ── Constants ──

const ACCENT_EFFECTS = [
  { id: "gradient", label: "Grad" },
  { id: "neon", label: "Neon" },
  { id: "underline", label: "Sub" },
  { id: "highlight", label: "Dest" },
  { id: "bold-accent", label: "Neg" },
  { id: "stroke", label: "Cont" },
] as const;

const SIZE_PRESETS = [
  { label: "P", size: "small", title: "Pequeno" },
  { label: "N", size: "normal", title: "Normal" },
  { label: "G", size: "large", title: "Grande" },
  { label: "D", size: "display", title: "Destaque" },
] as const;

// ── Toolbar helpers ──

function TBtn({
  active,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex h-7 min-w-[1.75rem] items-center justify-center rounded px-1.5 text-[11px] font-medium transition ${
        active
          ? "bg-[#22D3EE]/20 text-[#22D3EE]"
          : "text-[var(--platform-text)]/60 hover:bg-white/10 hover:text-[var(--platform-text)]"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="mx-0.5 h-4 w-px shrink-0 bg-white/15" />;
}

// ── Props ──

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  paletteColors?: string[];
  showFreePicker?: boolean;
  singleLine?: boolean;
  minHeight?: string;
  className?: string;
}

// ── Component ──

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite aqui…",
  paletteColors = [],
  showFreePicker = false,
  singleLine = false,
  minHeight = "2.5rem",
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, code: false, codeBlock: false }),
      TextStyle,
      Color,
      Underline,
      AccentEffect,
      TextSize,
    ],
    content: value,
    onUpdate({ editor: e }) {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content outline-none",
        style: `min-height: ${minHeight}; padding: 0.5rem 0.75rem;`,
      },
      handleKeyDown(_view: unknown, event: KeyboardEvent) {
        if (singleLine && event.key === "Enter") {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  // Sync value when changed externally (e.g., dispatch from reducer)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value ?? "", false);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null;

  const activeEffect = editor.isActive("accentEffect")
    ? (editor.getAttributes("accentEffect").effect as string)
    : null;

  const activeSize = editor.isActive("textSize")
    ? (editor.getAttributes("textSize").size as string)
    : "normal";

  const activeColor = editor.getAttributes("textStyle").color as string | undefined;

  function setAccentEffect(effect: string) {
    if (activeEffect === effect) {
      editor!.chain().focus().unsetMark("accentEffect").run();
    } else {
      editor!.chain().focus().setMark("accentEffect", { effect }).run();
    }
  }

  function setSize(size: string) {
    if (size === "normal" || activeSize === size) {
      editor!.chain().focus().unsetMark("textSize").run();
    } else {
      editor!.chain().focus().setMark("textSize", { size }).run();
    }
  }

  function setColor(color: string) {
    if (activeColor === color) {
      editor!.chain().focus().unsetColor().run();
    } else {
      editor!.chain().focus().setColor(color).run();
    }
  }

  function clearAll() {
    editor!
      .chain()
      .focus()
      .unsetBold()
      .unsetItalic()
      .unsetUnderline()
      .unsetColor()
      .unsetMark("accentEffect")
      .unsetMark("textSize")
      .run();
  }

  return (
    <div
      className={`relative rounded-lg border border-white/10 bg-white/[0.04] transition focus-within:border-[#22D3EE] ${className}`}
    >
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 120,
          placement: "top",
          offset: [0, 10],
          animation: "shift-away",
        }}
      >
        <div
          className="flex flex-wrap items-center gap-0.5 rounded-xl px-1.5 py-1.5"
          style={{
            background: "rgba(11,16,32,0.97)",
            border: "1px solid rgba(34,211,238,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Bold / Italic / Underline */}
          <TBtn active={editor.isActive("bold")} title="Negrito (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={11} strokeWidth={2.5} />
          </TBtn>
          <TBtn active={editor.isActive("italic")} title="Itálico (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={11} />
          </TBtn>
          <TBtn active={editor.isActive("underline")} title="Sublinhado (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon size={11} />
          </TBtn>

          <Sep />

          {/* Size presets */}
          {SIZE_PRESETS.map((p) => (
            <TBtn key={p.size} active={activeSize === p.size} title={p.title} onClick={() => setSize(p.size)}>
              {p.label}
            </TBtn>
          ))}

          {/* Colors */}
          {(paletteColors.length > 0 || showFreePicker) && <Sep />}
          {paletteColors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onMouseDown={(e) => { e.preventDefault(); setColor(color); }}
              className={`h-5 w-5 rounded-full border-2 transition hover:scale-105 ${
                activeColor === color ? "border-white scale-110" : "border-transparent hover:border-white/40"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          {showFreePicker && (
            <label
              title="Cor personalizada"
              className="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-white/30 overflow-hidden hover:border-white/50 transition"
              style={{ background: activeColor && !paletteColors.includes(activeColor) ? activeColor : "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
            >
              <input
                type="color"
                value={activeColor || "#22d3ee"}
                onChange={(e) => setColor(e.target.value)}
                className="absolute opacity-0 h-full w-full cursor-pointer"
              />
            </label>
          )}

          <Sep />

          {/* Visual effects */}
          <span className="flex items-center gap-0.5">
            <Sparkles size={9} className="text-[#22D3EE]/60 mr-0.5" />
            {ACCENT_EFFECTS.map((ef) => (
              <TBtn key={ef.id} active={activeEffect === ef.id} title={ef.id} onClick={() => setAccentEffect(ef.id)}>
                {ef.label}
              </TBtn>
            ))}
          </span>

          <Sep />

          {/* Clear formatting */}
          <TBtn title="Limpar formatação" onClick={clearAll}>
            <X size={10} />
          </TBtn>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      {/* Placeholder */}
      {editor.isEmpty && (
        <div className="pointer-events-none absolute left-3 top-[0.5rem] select-none text-sm text-[var(--platform-text)]/30">
          {placeholder}
        </div>
      )}
    </div>
  );
}
