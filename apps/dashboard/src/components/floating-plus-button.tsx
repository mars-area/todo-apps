import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingPlusButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="default" size="icon" className="fixed bottom-4 right-4 z-50 size-10 shadow-lg hover:bg-primary/80 hover:text-primary-foreground" onClick={onClick}>
      <PlusIcon className="size-4" />
    </Button>
  );
}