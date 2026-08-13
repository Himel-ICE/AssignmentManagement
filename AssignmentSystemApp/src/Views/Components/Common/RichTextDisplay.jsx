import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";

export default function RichTextDisplay({
    content = "",
    className = "",
    emptyText = "No answer provided.",
}) {

    const ref = useRef(null);

    useEffect(() => {

        if (!ref.current || !content || !content.includes("$")) return;

        try {

            renderMathInElement(ref.current, {
                throwOnError: false,
                strict: false,
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                ],
                ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
            });

        } catch {
            // Ignore render errors so content is always visible.
        }

    }, [content]);

    if (!content) {
        return (
            <p className="text-sm italic text-gray-400">
                {emptyText}
            </p>
        );
    }

    const isPlainText = !/<[a-z][\s\S]*>/i.test(content);

    if (isPlainText) {
        return (
            <p className={`whitespace-pre-wrap text-sm leading-relaxed text-gray-700 ${className}`}>
                {content}
            </p>
        );
    }

    return (
        <div
            ref={ref}
            className={`max-w-none text-sm leading-relaxed text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-cyan-600 [&_a]:underline ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );

}
