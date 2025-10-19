import { Link } from "wouter";

export function Header() {
  return (
    <header className="h-16 border-b border-border flex items-center px-4">
      <div className="max-w-2xl mx-auto w-full">
        <Link href="/" data-testid="link-home">
          <h1 className="text-2xl font-bold tracking-tight">Whispr</h1>
        </Link>
      </div>
    </header>
  );
}
