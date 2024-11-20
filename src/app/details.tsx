import { useDeferredValue, useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EslintResults,
  EslintRulesMeta,
  ErrorEslintResults,
  WarningEslintResults,
} from "@/formatter/config";
import { useDetail } from "./detailContext";

const ITEMS_PER_PAGE = 10;
const PAGINATION_MARGIN = window.innerWidth < 640 ? 2 : 3;

const Details = () => {
  const [openFiles, setOpenFiles] = useState<string[]>([]);

  const { searchTerm, changeSearchTerm, tab, changeTab } = useDetail();
  const [detailsPage, setDetailsPage] = useState(1);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const tabFilteredDetails = useMemo(() => {
    if (tab === "warnings") return WarningEslintResults;
    if (tab === "errors") return ErrorEslintResults;
    return EslintResults;
  }, [tab]);

  const termsFilteredDetails = useMemo(() => {
    return tabFilteredDetails.filter((result) => {
      return (
        result.filePath.includes(deferredSearchTerm) ||
        result.messages.some(
          (messageInfo) =>
            messageInfo.message.includes(deferredSearchTerm) ||
            messageInfo.ruleId?.includes(deferredSearchTerm)
        )
      );
    });
  }, [deferredSearchTerm, tabFilteredDetails]);

  const viewingDetails = useMemo(() => {
    const startIndex = (detailsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return termsFilteredDetails.slice(startIndex, endIndex);
  }, [detailsPage, termsFilteredDetails]);

  const minPage = 1;
  const maxPage = Math.ceil(termsFilteredDetails.length / ITEMS_PER_PAGE);

  const viewingMinPage = Math.max(minPage, detailsPage - PAGINATION_MARGIN);
  const viewingMaxPage = Math.min(detailsPage + PAGINATION_MARGIN, maxPage);

  const hasPrefixEllipsis = viewingMinPage > minPage;
  const hasSuffixEllipsis = viewingMaxPage < maxPage;

  const handleChangeTab = (value: string) => {
    setDetailsPage(1);
    setOpenFiles([]);
    changeTab(value as "all" | "warnings" | "errors");
  };

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    changeSearchTerm(input.value);
    input.value = "";
  };

  const toggleFile = (file: string) => {
    setOpenFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  return (
    <>
      <div id="details" className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-fg-default)]">
          Details
        </h2>

        {/* Search + Tabs */}
        <div className="mb-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <form
            className="relative w-full md:w-64"
            onSubmit={handleSubmitSearch}
          >
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]" />
            <Input
              type="text"
              name="search"
              placeholder="Search files or errors..."
              defaultValue=""
              className="pl-8 w-full bg-[var(--color-canvas-default)] border-[var(--color-border-default)] text-[var(--color-fg-default)] placeholder-[var(--color-fg-muted)]"
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
          <Tabs
            className="w-full md:w-auto mt-4 md:mt-0"
            value={tab}
            onValueChange={handleChangeTab}
          >
            <TabsList className="grid w-full grid-cols-3 bg-[var(--color-canvas-subtle)]">
              <TabsTrigger
                value="all"
                className="px-2 py-1 text-sm data-[state=active]:bg-[var(--color-canvas-default)] data-[state=active]:text-[var(--color-fg-default)] text-[var(--color-fg-muted)]"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="warnings"
                className="px-2 py-1 text-sm data-[state=active]:bg-[var(--color-canvas-default)] data-[state=active]:text-[var(--color-fg-default)] text-[var(--color-fg-muted)]"
              >
                Warnings
              </TabsTrigger>
              <TabsTrigger
                value="errors"
                className="px-2 py-1 text-sm data-[state=active]:bg-[var(--color-canvas-default)] data-[state=active]:text-[var(--color-fg-default)] text-[var(--color-fg-muted)]"
              >
                Errors
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search keyword display */}
        {searchTerm && (
          <div className="mb-4 flex items-center bg-[var(--color-canvas-subtle)] rounded-md p-2">
            <span className="text-sm text-[var(--color-fg-muted)] mr-2">
              Search:
            </span>
            <span className="text-sm text-[var(--color-fg-default)] font-medium break-all">
              {searchTerm}
            </span>
            <button
              onClick={() => changeSearchTerm("")}
              className="ml-auto text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] ml-4"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Details */}
        {viewingDetails.length > 0 ? (
          <>
            <div className="space-y-2">
              {viewingDetails.map((item) => (
                <Collapsible
                  key={item.filePath}
                  open={openFiles.includes(item.filePath)}
                  onOpenChange={() => toggleFile(item.filePath)}
                  disabled={item.errorCount === 0 && item.warningCount === 0}
                >
                  <CollapsibleTrigger className="w-full">
                    <div
                      className={`rounded-lg border p-4 flex items-center bg-[var(--color-canvas-subtle)] ${
                        item.errorCount > 0
                          ? "border-[var(--color-danger-emphasis)]"
                          : item.warningCount > 0
                          ? "border-[var(--color-attention-emphasis)]"
                          : "border-[var(--color-border-default)]"
                      }`}
                    >
                      <ChevronRight
                        className={`h-4 w-4 mr-2 transition-transform ${
                          openFiles.includes(item.filePath)
                            ? "transform rotate-90"
                            : ""
                        } ${
                          item.errorCount === 0 && item.warningCount === 0
                            ? "opacity-25"
                            : ""
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-mono text-sm text-[var(--color-fg-default)] break-all">
                          {item.filePath}
                        </div>
                        <p className="font-mono text-sm">
                          <span className="text-[var(--color-fg-default)]">
                            {item.errorCount + item.warningCount} problems
                          </span>
                          {" ("}
                          <span
                            className={`${
                              item.errorCount > 0
                                ? "text-[var(--color-danger-fg)]"
                                : ""
                            }`}
                          >
                            {item.errorCount} errors
                          </span>
                          {", "}
                          <span
                            className={`${
                              item.warningCount > 0
                                ? "text-[var(--color-attention-fg)]"
                                : ""
                            }`}
                          >
                            {item.warningCount} warnings
                          </span>
                          {")"}
                        </p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.errorCount > 0 || item.warningCount > 0 ? (
                      <>
                        <div className="mt-2 ml-6">
                          <Tabs defaultValue="summary">
                            <TabsList className="bg-[var(--color-canvas-subtle)]">
                              <TabsTrigger
                                value="summary"
                                className="data-[state=active]:bg-[var(--color-canvas-default)] data-[state=active]:text-[var(--color-fg-default)] text-[var(--color-fg-muted)]"
                              >
                                Summary
                              </TabsTrigger>
                              <TabsTrigger
                                value="sourcecode"
                                className="data-[state=active]:bg-[var(--color-canvas-default)] data-[state=active]:text-[var(--color-fg-default)] text-[var(--color-fg-muted)]"
                              >
                                SourceCode
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="summary">
                              <div className="space-y-4">
                                {item.messages.map((messageInfo, index) => {
                                  const isError = messageInfo.severity === 2;
                                  return (
                                    <div
                                      key={
                                        messageInfo.messageId ||
                                        `${messageInfo.ruleId || ""}-${index}`
                                      }
                                      className={`rounded border-l-4 ${
                                        isError
                                          ? "border-l-[var(--color-danger-emphasis)] bg-[var(--color-danger-muted)]"
                                          : "border-l-[var(--color-attention-emphasis)] bg-[var(--color-attention-muted)]"
                                      } p-4`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`text-sm font-medium ${
                                              isError
                                                ? "text-[var(--color-danger-fg)]"
                                                : "text-[var(--color-attention-fg)]"
                                            }`}
                                          >
                                            {isError ? "Error" : "Warning"}
                                          </span>
                                          <span className="text-[var(--color-fg-default)]">
                                            Row {messageInfo.line}, Column{" "}
                                            {messageInfo.column}
                                          </span>
                                        </div>
                                        {messageInfo.ruleId &&
                                        EslintRulesMeta?.[messageInfo.ruleId]
                                          ?.docs?.url ? (
                                          <a
                                            href={
                                              EslintRulesMeta?.[
                                                messageInfo.ruleId
                                              ]?.docs?.url
                                            }
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="text-[var(--color-accent-fg)] text-sm hover:underline"
                                          >
                                            {messageInfo.ruleId}
                                          </a>
                                        ) : (
                                          <span className="text-[var(--color-accent-fg)]">
                                            {messageInfo.ruleId}
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-2 text-sm text-[var(--color-fg-default)] break-all">
                                        {messageInfo.message}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </TabsContent>
                            <TabsContent value="sourcecode">
                              <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] font-mono text-sm">
                                <table className="w-full">
                                  <tbody>
                                    {item.source
                                      ?.split("\n")
                                      ?.map((line, index) => {
                                        const lineNumber = index + 1;
                                        const messageForLine =
                                          item.messages.find(
                                            (e) => e.line === lineNumber
                                          );
                                        const isError =
                                          messageForLine?.severity === 2;
                                        const isWarning =
                                          messageForLine?.severity === 1;

                                        return (
                                          <tr
                                            key={index}
                                            className={
                                              isError
                                                ? "bg-[var(--color-danger-muted)]"
                                                : isWarning
                                                ? "bg-[var(--color-attention-muted)]"
                                                : index % 2 === 0
                                                ? "bg-[var(--color-canvas-default)]"
                                                : ""
                                            }
                                          >
                                            <td className="select-none border-r border-[var(--color-border-default)] px-4 py-1 text-right text-[var(--color-fg-muted)] w-12">
                                              {lineNumber}
                                            </td>
                                            <td className="px-4 py-1 relative">
                                              <pre className="whitespace-pre-wrap text-[var(--color-fg-default)]">
                                                {line}
                                              </pre>
                                              {(isError || isWarning) && (
                                                <div
                                                  className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-md"
                                                  style={{
                                                    backgroundColor: isError
                                                      ? "var(--color-danger-emphasis)"
                                                      : "var(--color-attention-emphasis)",
                                                    color:
                                                      "var(--color-fg-on-emphasis)",
                                                  }}
                                                >
                                                  {isError
                                                    ? "Error"
                                                    : "Warning"}
                                                </div>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </>
                    ) : (
                      <DetailTabContentNoData />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination className="transform origin-center scale-[0.8] sm:scale-100">
                <PaginationContent>
                  {detailsPage > viewingMinPage && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#details"
                        onClick={() => setDetailsPage(detailsPage - 1)}
                        className="text-[var(--color-fg-default)] border-[var(--color-border-default)] hover:bg-[var(--color-border-default)]"
                      />
                    </PaginationItem>
                  )}
                  {hasPrefixEllipsis && (
                    <PaginationEllipsis className="text-[var(--color-fg-muted)]" />
                  )}
                  {Array.from({
                    length: viewingMaxPage - viewingMinPage + 1,
                  }).map((_, index) => (
                    <PaginationItem key={viewingMinPage + index}>
                      <PaginationLink
                        href="#details"
                        isActive={detailsPage === viewingMinPage + index}
                        onClick={() => setDetailsPage(viewingMinPage + index)}
                        className={`text-[var(--color-fg-default)] border-[var(--color-border-default)] ${
                          detailsPage === viewingMinPage + index
                            ? "bg-[var(--color-border-default)]"
                            : "hover:bg-[var(--color-border-default)]"
                        }`}
                      >
                        {viewingMinPage + index}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {hasSuffixEllipsis && (
                    <PaginationEllipsis className="text-[var(--color-fg-muted)]" />
                  )}
                  {detailsPage < viewingMaxPage && (
                    <PaginationItem>
                      <PaginationNext
                        href="#details"
                        onClick={() => setDetailsPage(detailsPage + 1)}
                        className="text-[var(--color-fg-default)] border-[var(--color-border-default)] hover:bg-[var(--color-border-default)]"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <DetailsNoData />
        )}
      </div>
    </>
  );
};

const DetailsNoData = () => {
  return (
    <p className="text-center py-4 text-[var(--color-fg-muted)]">
      No Details to display
    </p>
  );
};

const DetailTabContentNoData = () => {
  return (
    <p className="mt-2 ml-6 text-[var(--color-fg-muted)]">
      No Errors or Warnings to display
    </p>
  );
};

export default Details;
