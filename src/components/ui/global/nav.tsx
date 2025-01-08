import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "@mynaui/icons-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

const navLinks = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "#" },
  { label: "Changelog", href: "#" },
];

export function Nav({ className }: { className?: string }) {
  const pathname = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={cn(
        "relative flex w-full items-center justify-between p-4",
        className,
      )}
    >
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        Launch UI
      </Link>

      <div className="hidden md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className={cn(
              "mx-2 rounded-lg px-2 py-0.5 text-sm text-primary/60 hover:bg-accent hover:text-primary",
              pathname.pathname === link.href &&
                "bg-accent px-2 py-0.5 text-primary",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 left-0 top-0 z-50 bg-background md:hidden">
          <div className="flex h-full flex-col p-4">
            <div className="mb-8 flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold"
              >
                Launch UI
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-base text-primary/60 hover:bg-accent hover:text-primary",
                    pathname.pathname === link.href &&
                      "bg-accent px-4 py-2 text-primary",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto">
              <Link to="/signin" className="w-full">
                <Button className="w-full" variant="outline" size="lg">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <Link to="/signin">
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </Link>
      </div>
    </nav>
  );
}
