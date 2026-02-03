import Image from 'next/image';

interface InlineMediaProps {
    src: string;
    alt?: string;
    caption?: string;
}

export default function InlineMedia({ src, alt, caption }: InlineMediaProps) {
    if (!src) return null;

    return (
        <span className="inline-block w-full my-6">
            <span className="relative block w-full h-[400px] md:h-[500px]">
                <Image
                    src={src}
                    alt={alt || 'Illustration'}
                    fill
                    className="object-contain drop-shadow-md"
                />
            </span>
            {caption && (
                <span className="block mt-3 text-center text-sm text-gray-500 italic">
                    {caption}
                </span>
            )}
        </span>
    );
}
