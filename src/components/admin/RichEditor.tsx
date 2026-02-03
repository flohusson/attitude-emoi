'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon,
    Heading2, Heading3,
    Palette, Undo, Redo,
    Image as ImageIcon, Link as LinkIcon,
    Check, X, HelpCircle,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { useEffect, useState } from 'react';

// FontSize extension for TextStyle
const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
        return [
            {
                types: ['textStyle'],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize || null,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return { style: `font-size: ${attributes.fontSize}` };
                        },
                    },
                },
            },
        ];
    },
});

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown.configure({
                html: true,
                transformPastedText: true,
                transformCopiedText: true,
            }),
            TextStyle,
            FontSize,
            Color,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-stone max-w-none focus:outline-none min-h-[500px] p-8 [&_strong]:text-inherit [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium',
            },
        },
        onUpdate: ({ editor }) => {
            // Get HTML and clean inline styles that can cause display issues
            let html = editor.getHTML();
            // Remove style attributes EXCEPT text-align and font-size
            html = html.replace(/\s+style="([^"]*)"/g, (match, styleContent) => {
                // Keep only text-align and font-size if present
                const textAlignMatch = styleContent.match(/text-align:\s*[^;]+/);
                const fontSizeMatch = styleContent.match(/font-size:\s*[^;]+/);

                const preservedStyles = [];
                if (textAlignMatch) preservedStyles.push(textAlignMatch[0]);
                if (fontSizeMatch) preservedStyles.push(fontSizeMatch[0]);

                if (preservedStyles.length > 0) {
                    return ` style="${preservedStyles.join('; ')}"`;
                }
                return ''; // Remove style attribute if nothing to preserve
            });
            // Add line breaks after closing tags to prevent single-line issues
            html = html.replace(/(<\/[^>]+>)/g, '$1\n');
            onChange(html);
        },
    });

    const [activeTool, setActiveTool] = useState<'none' | 'button' | 'media' | 'link'>('none');
    const [inputValue, setInputValue] = useState('');
    const [currentFontSize, setCurrentFontSize] = useState('16px');

    // Update editor content if external value changes (and is different)
    // This is tricky with WYSIWYG, but needed for initial load or resets
    useEffect(() => {
        if (editor && value && (editor.storage as any).markdown.getMarkdown() !== value) {
            // Only update if significantly different to avoid cursor jumps
            // For now, we assume this is mostly for initial load. 
            // Better strategy: only set if editor is empty or on specific flag.
            // But basic check:
            if (editor.getText() === '') {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    // Track font size based on current selection
    useEffect(() => {
        if (!editor) return;

        const updateFontSize = () => {
            const fontSize = editor.getAttributes('textStyle').fontSize || '16px';
            setCurrentFontSize(fontSize);
        };

        // Update on selection change
        editor.on('selectionUpdate', updateFontSize);
        editor.on('transaction', updateFontSize);

        // Initial update
        updateFontSize();

        return () => {
            editor.off('selectionUpdate', updateFontSize);
            editor.off('transaction', updateFontSize);
        };
    }, [editor]);

    const handleInputConfirm = () => {
        if (!editor) return;

        if (!inputValue) {
            setActiveTool('none');
            return;
        }

        if (activeTool === 'button') {
            const { from, to, empty } = editor.state.selection;
            const selectedText = !empty ? editor.state.doc.textBetween(from, to) : 'Voir le lien';
            editor.chain().focus().insertContent(` [button link="${inputValue}"]${selectedText}[/button] `).run();
        } else if (activeTool === 'media') {
            if (['1', '2', '3'].includes(inputValue)) {
                editor.chain().focus().insertContent(` [media index="${inputValue}"] `).run();
            } else {
                alert("L'index doit être 1, 2 ou 3");
                return; // Don't close if invalid
            }
        } else if (activeTool === 'link') {
            if (inputValue) {
                editor.chain().focus().extendMarkRange('link').setLink({ href: inputValue }).run();
            } else {
                editor.chain().focus().unsetLink().run();
            }
        }

        setActiveTool('none');
        setInputValue('');
    };

    if (!editor) {
        return <div className="border border-gray-300 rounded-lg p-8 h-[600px] flex items-center justify-center text-gray-400">Chargement de l'éditeur...</div>;
    }

    return (
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-sm bg-white min-h-[600px]">
            <div className="sticky top-20 z-10 bg-white flex flex-wrap items-center gap-2 p-2 border-b border-gray-200">
                {/* Formatting Tools */}
                <div className="flex items-center gap-1">
                    {/* Font Size Controls */}
                    <ToolbarBtn
                        onClick={() => {
                            const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
                            const size = parseInt(currentSize);
                            editor.chain().focus().setMark('textStyle', { fontSize: `${size + 2}px` }).run();
                        }}
                        icon={<span className="font-bold">A+</span>}
                        title="Augmenter la taille"
                    />
                    <div className="px-2 py-1 text-xs font-mono text-gray-600 bg-gray-50 rounded border border-gray-200 min-w-[45px] text-center">
                        {currentFontSize}
                    </div>
                    <ToolbarBtn
                        onClick={() => {
                            const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
                            const size = parseInt(currentSize);
                            if (size > 10) {
                                editor.chain().focus().setMark('textStyle', { fontSize: `${size - 2}px` }).run();
                            }
                        }}
                        icon={<span className="text-sm">A-</span>}
                        title="Réduire la taille"
                    />
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={<Bold size={16} />}
                        title="Gras"
                    />
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={<Italic size={16} />}
                        title="Italique"
                    />
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        icon={<UnderlineIcon size={16} />}
                        title="Souligné"
                    />
                    <ToolbarBtn
                        onClick={() => {
                            const previousUrl = editor.getAttributes('link').href;
                            setInputValue(previousUrl || '');
                            setActiveTool('link');
                        }}
                        isActive={editor.isActive('link')}
                        icon={<LinkIcon size={16} />}
                        title="Lien"
                    />

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon={<Heading2 size={16} />}
                        title="Titre 2"
                    />
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        icon={<Heading3 size={16} />}
                        title="Titre 3"
                    />

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Alignment */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded p-1 border border-gray-200">
                        <ToolbarBtn
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            icon={<AlignLeft size={16} />}
                            title="Aligner à gauche"
                        />
                        <ToolbarBtn
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            icon={<AlignCenter size={16} />}
                            title="Centrer"
                        />
                        <ToolbarBtn
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            icon={<AlignRight size={16} />}
                            title="Aligner à droite"
                        />
                        <ToolbarBtn
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            isActive={editor.isActive({ textAlign: 'justify' })}
                            icon={<AlignJustify size={16} />}
                            title="Justifier"
                        />
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Colors */}
                    <div className="flex items-center gap-1 bg-white rounded p-1 border border-gray-200">
                        <span className="text-gray-400 px-1"><Palette size={14} /></span>

                        {/* Attitude Colors */}
                        <ColorBtn color="#f5c43d" editor={editor} title="Jaune Attitude" />
                        <ColorBtn color="#96b094" editor={editor} title="Vert Sauge" />
                        <ColorBtn color="#2D2A26" editor={editor} title="Noir Text" />

                        {/* Custom Picker */}
                        <input
                            type="color"
                            onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className="w-6 h-6 p-0 border-0 rounded cursor-pointer ml-1"
                            title="Choisir une couleur"
                        />
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {activeTool === 'none' ? (
                        <>
                            <ToolbarBtn
                                onClick={() => { setActiveTool('button'); setInputValue(''); }}
                                icon={<div className="font-bold text-xs uppercase px-1">BTN</div>}
                                title="Bouton CTA"
                                isActive={false}
                            />
                            <ToolbarBtn
                                onClick={() => { setActiveTool('media'); setInputValue(''); }}
                                icon={<ImageIcon size={16} />}
                                title="Insérer Média"
                                isActive={false}
                            />
                            <ToolbarBtn
                                onClick={() => editor.chain().focus().insertContent('\n[accordion title="Votre Question"]\nVotre Réponse\n[/accordion]\n').run()}
                                icon={<HelpCircle size={16} />}
                                title="Insérer FAQ"
                                isActive={false}
                            />
                        </>
                    ) : (
                        <div className="flex items-center gap-1 bg-white border border-blue-200 rounded px-1 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                            <input
                                type="text"
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleInputConfirm();
                                    if (e.key === 'Escape') setActiveTool('none');
                                }}
                                placeholder={activeTool === 'button' || activeTool === 'link' ? 'https://...' : 'ID (1, 2, 3)'}
                                className="text-sm border-none focus:ring-0 p-1 w-32 h-6 bg-transparent"
                            />
                            <button
                                onClick={handleInputConfirm}
                                className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                                title="Valider"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setActiveTool('none')}
                                className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                                title="Annuler"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* History */}
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm gap-1">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="p-1.5 text-gray-500 hover:text-primary disabled:opacity-30 transition-colors"
                        title="Annuler (Undo)"
                    >
                        <Undo size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="p-1.5 text-gray-500 hover:text-primary disabled:opacity-30 transition-colors"
                        title="Rétablir (Redo)"
                    >
                        <Redo size={16} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto bg-[#FAF9F6] cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>

            <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                <span>Mode WYSIWYG</span>
                <span>{value?.length || 0} car. (Markdown)</span>
            </div>
        </div>
    );
}

function ToolbarBtn({ onClick, icon, title, isActive }: { onClick: (e: any) => void, icon: React.ReactNode, title: string, isActive?: boolean }) {
    return (
        <button
            type="button"
            onClick={(e) => onClick(e)}
            title={title}
            className={`p-1.5 rounded transition-colors ${isActive ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-primary hover:bg-primary/10'}`}
        >
            {icon}
        </button>
    );
}

function ColorBtn({ color, editor, title }: { color: string, editor: any, title: string }) {
    return (
        <button
            type="button"
            onClick={() => editor.chain().focus().setColor(color).run()}
            className={`w-4 h-4 rounded-full hover:scale-125 transition-transform ring-1 ring-gray-200 border border-white ${editor.isActive('textStyle', { color }) ? 'ring-2 ring-primary' : ''}`}
            style={{ backgroundColor: color }}
            title={title}
        />
    );
}
