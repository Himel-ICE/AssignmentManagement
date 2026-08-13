import { useCallback, useEffect, useRef, useState } from "react";
import {
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
    RiBold,
    RiCodeBoxLine,
    RiEyeLine,
    RiEyeOffLine,
    RiItalic,
    RiListOrdered,
    RiListUnordered,
    RiStrikethrough,
    RiUnderline,
} from "react-icons/ri";

import RichTextDisplay from "./RichTextDisplay";

const SYMBOLS = [
    "√", "π", "∞", "≠", "≥", "≤", "±", "×", "÷",
    "²", "³", "½", "¼", "θ", "α", "β", "∑", "∫",
];

export default function RichTextEditor({
    value = "",
    onChange,
    placeholder = "Write your answer here...",
    maxLength = 5000,
    showPreview = true,
    minHeight = "min-h-40",
}) {

    const editorRef = useRef(null);

    const [isEmpty, setIsEmpty] = useState(!value);
    const [charCount, setCharCount] = useState(0);
    const [content, setContent] = useState(value);
    const [showSymbols, setShowSymbols] = useState(false);
    const [preview, setPreview] = useState(false);
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        ul: false,
        ol: false,
    });

    const emitChange = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        const html = editor.innerHTML;
        const text = editor.innerText || "";
        setIsEmpty(!text.trim());
        setCharCount(text.trim().length);
        const clean = html === "<br>" ? "" : html;
        setContent(clean);
        onChange?.(clean);
    }, [onChange]);

    useEffect(() => {
        if (editorRef.current) {
            const normalizeValue = (html) => {
                if (!html) return "";
                if (/<[a-z][\s\S]*>/i.test(html)) return html;
                return html.replace(/\n/g, "<br>");
            };
            editorRef.current.innerHTML = normalizeValue(value) || "";
            emitChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateActiveStates = useCallback(() => {
        setActiveStates({
            bold: document.queryCommandState("bold"),
            italic: document.queryCommandState("italic"),
            underline: document.queryCommandState("underline"),
            strike: document.queryCommandState("strikeThrough"),
            ul: document.queryCommandState("insertUnorderedList"),
            ol: document.queryCommandState("insertOrderedList"),
        });
    }, []);

    useEffect(() => {
        document.addEventListener("selectionchange", updateActiveStates);
        return () => document.removeEventListener("selectionchange", updateActiveStates);
    }, [updateActiveStates]);

    const exec = useCallback((command, arg = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, arg);
        emitChange();
    }, [emitChange]);

    const insertSymbol = useCallback((symbol) => {
        editorRef.current?.focus();
        document.execCommand("insertText", false, symbol);
        emitChange();
    }, [emitChange]);

    const wrapEquation = useCallback((left, right) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const selection = window.getSelection();
        const selectedText = selection && selection.rangeCount > 0
            ? selection.toString()
            : "";
        const inserted = selectedText
            ? `${left}${selectedText}${right}`
            : `${left}${right}`;
        document.execCommand("insertText", false, inserted);
        emitChange();
    }, [emitChange]);

    const handleInput = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const text = editor.innerText || "";

        if (text.length > maxLength) {
            editor.innerText = text.slice(0, maxLength);
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
        }

        emitChange();
    }, [emitChange, maxLength]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        emitChange();
    }, [emitChange]);

    const ToolButton = ({ title, active = false, onClick, children }) => (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { editorRef.current?.focus(); onClick?.(); }}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                active
                    ? "bg-cyan-600 text-white"
                    : "text-gray-600 hover:bg-cyan-100 hover:text-cyan-700"
            }`}
        >
            {children}
        </button>
    );

    const Divider = () => (
        <span className="mx-1 h-5 w-px shrink-0 bg-cyan-200" />
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-cyan-300 bg-white">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-cyan-200 bg-cyan-50/60 px-2 py-1.5">

                <ToolButton title="Bold (Ctrl+B)" active={activeStates.bold} onClick={() => exec("bold")}>
                    <RiBold size={16} />
                </ToolButton>
                <ToolButton title="Italic (Ctrl+I)" active={activeStates.italic} onClick={() => exec("italic")}>
                    <RiItalic size={16} />
                </ToolButton>
                <ToolButton title="Underline (Ctrl+U)" active={activeStates.underline} onClick={() => exec("underline")}>
                    <RiUnderline size={16} />
                </ToolButton>
                <ToolButton title="Strikethrough" active={activeStates.strike} onClick={() => exec("strikeThrough")}>
                    <RiStrikethrough size={16} />
                </ToolButton>

                <Divider />

                <ToolButton title="Bullet list" active={activeStates.ul} onClick={() => exec("insertUnorderedList")}>
                    <RiListUnordered size={16} />
                </ToolButton>
                <ToolButton title="Numbered list" active={activeStates.ol} onClick={() => exec("insertOrderedList")}>
                    <RiListOrdered size={16} />
                </ToolButton>

                <Divider />

                <ToolButton title="Inline equation ( $...$ )" onClick={() => wrapEquation("$", "$")}>
                    <RiCodeBoxLine size={16} />
                </ToolButton>
                <ToolButton title="Display equation ( $$...$$ )" onClick={() => wrapEquation("$$", "$$")}>
                    <span className="text-sm font-bold">$$</span>
                </ToolButton>

                <Divider />

                <ToolButton title="Undo (Ctrl+Z)" onClick={() => exec("undo")}>
                    <RiArrowGoBackLine size={16} />
                </ToolButton>
                <ToolButton title="Redo (Ctrl+Y)" onClick={() => exec("redo")}>
                    <RiArrowGoForwardLine size={16} />
                </ToolButton>

            </div>

            {/* Math symbol palette */}
            {showSymbols && (
                <div className="flex flex-wrap items-center gap-1 border-b border-amber-200 bg-amber-50/50 px-2 py-1.5">
                    {SYMBOLS.map((symbol) => (
                        <button
                            key={symbol}
                            type="button"
                            title={`Insert ${symbol}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => insertSymbol(symbol)}
                            className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-medium text-gray-700 transition hover:bg-amber-200"
                        >
                            {symbol}
                        </button>
                    ))}
                </div>
            )}

            {/* Editor */}
            <div className="relative">
                {isEmpty && (
                    <div className="pointer-events-none absolute left-4 top-3 text-sm text-gray-400">
                        {placeholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={emitChange}
                    onPaste={handlePaste}
                    className={`${minHeight} px-4 py-3 text-sm leading-relaxed text-gray-800 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-cyan-600 [&_a]:underline`}
                />
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cyan-200 bg-cyan-50/60 px-3 py-1.5">

                <button
                    type="button"
                    onClick={() => setShowSymbols((v) => !v)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                        showSymbols
                            ? "bg-amber-500 text-white"
                            : "text-cyan-700 hover:bg-amber-100"
                    }`}
                >
                    ∑ Math Symbols
                </button>

                <div className="flex items-center gap-3">

                    <span className={`text-xs font-medium ${charCount >= maxLength ? "text-rose-600" : "text-gray-500"}`}>
                        {charCount}/{maxLength}
                    </span>

                    {showPreview && (
                        <button
                            type="button"
                            onClick={() => setPreview((v) => !v)}
                            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                        >
                            {preview ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                            {preview ? "Hide Preview" : "Preview"}
                        </button>
                    )}

                </div>

            </div>

            {/* Live preview */}
            {showPreview && preview && (
                <div className="border-t border-cyan-200 bg-gray-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Preview
                    </p>
                    <RichTextDisplay content={content} />
                </div>
            )}

        </div>
    );

}
