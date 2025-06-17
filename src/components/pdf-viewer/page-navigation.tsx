interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PageNavigation({
  currentPage,
  totalPages,
  onPageChange,
}: PageNavigationProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value) || 1;
    onPageChange(page);
  };

  return (
    <div className="border-t bg-card p-4">
      <div className="flex items-center justify-center gap-2">
        <span className="text-muted-foreground text-sm">Jump to page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={handleInputChange}
          className="w-16 rounded border px-2 py-1 text-center text-sm"
          title="Enter page number to navigate to"
        />
        <span className="text-muted-foreground text-sm">of {totalPages}</span>
      </div>
    </div>
  );
}
