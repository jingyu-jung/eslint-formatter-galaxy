import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEslintTopErrorsAndWarnings } from "@/formatter/config";
import { useMemo } from "react";

const MAX_COUNT = 10;

const TopErrorAndWarnings = () => {
  const { sortedErrorCounts, sortedWarningCounts, rulesMeta } = useMemo(
    () => getEslintTopErrorsAndWarnings(MAX_COUNT),
    []
  );

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2
            className="mb-4 text-lg font-semibold text-[var(--color-danger-fg)]"
            id="top-errors"
          >
            Top errors
          </h2>
          {sortedErrorCounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--color-border-default)]">
                  <TableHead className="text-[var(--color-fg-default)]">
                    Rule
                  </TableHead>
                  <TableHead className="text-right text-[var(--color-fg-default)]">
                    Count
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedErrorCounts.map(([ruleName, count]) => (
                  <TableRow
                    key={ruleName}
                    className="border-b border-[var(--color-border-default)]"
                  >
                    <TableCell className="text-[var(--color-fg-default)]">
                      {rulesMeta?.[ruleName]?.url ? (
                        <a
                          href={rulesMeta?.[ruleName]?.url ?? ""}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[var(--color-accent-fg)] hover:underline"
                        >
                          {ruleName}
                        </a>
                      ) : (
                        ruleName
                      )}
                    </TableCell>
                    <TableCell className="text-right text-[var(--color-fg-default)]">
                      {count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <TopErrorAndWarningsNoData />
          )}
        </div>

        <div>
          <h2
            className="mb-4 text-lg font-semibold text-[var(--color-attention-fg)]"
            id="top-warnings"
          >
            Top warnings
          </h2>
          {sortedWarningCounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[var(--color-border-default)]">
                  <TableHead className="text-[var(--color-fg-default)]">
                    Rule
                  </TableHead>
                  <TableHead className="text-right text-[var(--color-fg-default)]">
                    Count
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedWarningCounts.map(([ruleName, count]) => (
                  <TableRow
                    key={ruleName}
                    className="border-b border-[var(--color-border-default)]"
                  >
                    <TableCell className="text-[var(--color-fg-default)]">
                      {rulesMeta?.[ruleName]?.url ? (
                        <a
                          href={rulesMeta?.[ruleName]?.url ?? ""}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[var(--color-accent-fg)] hover:underline"
                        >
                          {ruleName}
                        </a>
                      ) : (
                        ruleName
                      )}
                    </TableCell>
                    <TableCell className="text-right text-[var(--color-fg-default)]">
                      {count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <TopErrorAndWarningsNoData />
          )}
        </div>
      </div>
    </>
  );
};

const TopErrorAndWarningsNoData = () => {
  return (
    <p className="text-center py-4 text-[var(--color-fg-muted)]">
      No errors or warnings found
    </p>
  );
};

export default TopErrorAndWarnings;
