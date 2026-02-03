import Link from 'next/link';

interface ButtonProps {
    href: string;
    children: React.ReactNode;
}

export default function Button({ href, children }: ButtonProps) {
    return (
        <span className="my-8 flex justify-center w-full">
            <Link
                href={href}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-base font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                {children}
            </Link>
        </span>
    );
}
