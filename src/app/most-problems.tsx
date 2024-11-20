import { useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSortedFilesByErrorAndWarningCount } from "@/formatter/config";
import { useDetail } from "./detailContext";

const ITEMS_PER_PAGE = 10;
const PAGINATION_MARGIN = window.innerWidth < 640 ? 2 : 3;

const MostProblems = () => {
  const sortedFilesByErrorAndWarningCount = useMemo(
    () => getSortedFilesByErrorAndWarningCount(),
    []
  );

  return (
    <div className="mt-8" id="most-problems">
      <h2 className="mb-4 text-lg font-semibold text-[var(--color-fg-default)]">
        Most Problems
      </h2>
      {sortedFilesByErrorAndWarningCount.length > 0 ? (
        <MostProblemsTable data={sortedFilesByErrorAndWarningCount} />
      ) : (
        <MostProblemsNoData />
      )}
    </div>
  );
};

interface MostProblemsTableProps {
  data: [string, { errors: number; warnings: number }][];
}

const MostProblemsTable = ({ data }: MostProblemsTableProps) => {
  const { changeSearchTerm, changeTab } = useDetail();
  const [mostProblemsPage, setMostProblemsPage] = useState(1);

  const mostProblems = useMemo(() => {
    const startIndex = (mostProblemsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [mostProblemsPage, data]);

  const minPage = 1;
  const maxPage = Math.ceil(data.length / ITEMS_PER_PAGE);

  const viewingMinPage = Math.max(
    minPage,
    mostProblemsPage - PAGINATION_MARGIN
  );
  const viewingMaxPage = Math.min(
    mostProblemsPage + PAGINATION_MARGIN,
    maxPage
  );

  const hasPrefixEllipsis = viewingMinPage > minPage;
  const hasSuffixEllipsis = viewingMaxPage < maxPage;

  const handlePaginationClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const element = document.getElementById("most-problems");
    if (element) {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (isVisible) {
        event.preventDefault();
      }
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[var(--color-border-default)]">
            <TableHead className="text-[var(--color-fg-default)]">
              File Path
            </TableHead>
            <TableHead className="text-right text-[var(--color-fg-default)]">
              Errors
            </TableHead>
            <TableHead className="text-right text-[var(--color-fg-default)]">
              Warnings
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mostProblems.map(([fileName, { errors, warnings }]) => (
            <TableRow
              key={fileName}
              className="border-b border-[var(--color-border-default)]"
            >
              <TableCell className="text-[var(--color-fg-default)] break-all">
                <a
                  href="#details"
                  className="text-[var(--color-accent-fg)] hover:underline"
                  onClick={() => {
                    changeSearchTerm(fileName);
                    changeTab("all");
                  }}
                >
                  {fileName}
                </a>
              </TableCell>
              <TableCell className="text-right text-[var(--color-fg-default)]">
                {errors}
              </TableCell>
              <TableCell className="text-right text-[var(--color-fg-default)]">
                {warnings}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination className="transform origin-center scale-[0.8] sm:scale-100">
          <PaginationContent>
            {mostProblemsPage > viewingMinPage && (
              <PaginationItem>
                <PaginationPrevious
                  href="#most-problems"
                  onClick={(event) => {
                    handlePaginationClick(event);
                    setMostProblemsPage(mostProblemsPage - 1);
                  }}
                  className="text-[var(--color-fg-default)] border-[var(--color-border-default)] hover:bg-[var(--color-border-default)]"
                />
              </PaginationItem>
            )}
            {hasPrefixEllipsis && (
              <PaginationEllipsis className="text-[var(--color-fg-muted)]" />
            )}
            {Array.from({ length: viewingMaxPage - viewingMinPage + 1 }).map(
              (_, index) => (
                <PaginationItem key={viewingMinPage + index}>
                  <PaginationLink
                    href="#most-problems"
                    isActive={mostProblemsPage === viewingMinPage + index}
                    onClick={(event) => {
                      handlePaginationClick(event);
                      setMostProblemsPage(viewingMinPage + index);
                    }}
                    className={`text-[var(--color-fg-default)] border-[var(--color-border-default)] ${
                      mostProblemsPage === viewingMinPage + index
                        ? "bg-[var(--color-border-default)]"
                        : "hover:bg-[var(--color-border-default)]"
                    }`}
                  >
                    {viewingMinPage + index}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            {hasSuffixEllipsis && (
              <PaginationEllipsis className="text-[var(--color-fg-muted)]" />
            )}
            {mostProblemsPage < viewingMaxPage && (
              <PaginationItem>
                <PaginationNext
                  href="#most-problems"
                  onClick={(event) => {
                    handlePaginationClick(event);
                    setMostProblemsPage(mostProblemsPage + 1);
                  }}
                  className="text-[var(--color-fg-default)] border-[var(--color-border-default)] hover:bg-[var(--color-border-default)]"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

const MostProblemsNoData = () => {
  return (
    <p className="text-center py-4 text-[var(--color-fg-muted)]">
      No Problems to display
    </p>
  );
};

export default MostProblems;
