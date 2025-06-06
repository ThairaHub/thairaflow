import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DEFAULT_FOLDER,
  DEFAULT_FOLDER_DEPRECATED,
} from "@/constants/constants";
import { ENABLE_MCP } from "@/customization/feature-flags";
import { cn } from "@/utils/utils";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderComponentProps {
  flowType: "flows" | "components" | "mcp" | "landing page" | "CRM";
  setFlowType: (flowType: "flows" | "components" | "mcp") => void;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  setNewProjectModal: (newProjectModal: boolean) => void;
  folderName?: string;
  setSearch: (search: string) => void;
  isEmptyFolder: boolean;
}

const HeaderComponent = ({
  folderName = "",
  flowType,
  setFlowType,
  view,
  setView,
  setNewProjectModal,
  setSearch,
  isEmptyFolder,
}: HeaderComponentProps) => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isMCPEnabled = ENABLE_MCP;
  // Debounce the setSearch function from the parent
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 1000),
    [setSearch],
  );

  useEffect(() => {
    debouncedSetSearch(debouncedSearch);

    return () => {
      debouncedSetSearch.cancel(); // Cleanup on unmount
    };
  }, [debouncedSearch, debouncedSetSearch]);

  // If current flowType is not available based on feature flag, switch to flows
  useEffect(() => {
    if (
      (flowType === "mcp" && !isMCPEnabled) ||
      (flowType === "components" && isMCPEnabled)
    ) {
      setFlowType("flows");
    }
  }, [flowType, isMCPEnabled, setFlowType]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value);
  };

  // Determine which tabs to show based on feature flag
  const tabTypes = isMCPEnabled ? ["mcp", "flows", "landing page", "CRM"] : ["components", "flows"];

  return (
    <>
      <div
        className="flex items-center pb-8 text-xl font-semibold"
        data-testid="mainpage_title"
      >
        <div className="h-7 w-10 transition-all group-data-[open=true]/sidebar-wrapper:md:w-0 lg:hidden">
          <div className="relative left-0 opacity-100 transition-all group-data-[open=true]/sidebar-wrapper:md:opacity-0">
            <SidebarTrigger>
              <ForwardedIconComponent
                name="PanelLeftOpen"
                aria-hidden="true"
                className=""
              />
            </SidebarTrigger>
          </div>
        </div>
        {folderName === DEFAULT_FOLDER_DEPRECATED ? DEFAULT_FOLDER : folderName}
      </div>
      {!isEmptyFolder && (
        <>
          <div
            className={cn(
              "flex flex-row-reverse",
              flowType !== "mcp" && "pb-8",
            )}
          >
            <div className="w-full border-b dark:border-border" />
            {tabTypes.map((type) => (
              <Button
                key={type}
                unstyled
                id={`${type}-btn`}
                data-testid={`${type}-btn`}
                onClick={() => {
                  setFlowType(type as "flows" | "components" | "mcp");
                }}
                className={`border-b ${
                  flowType === type
                    ? "border-b-2 border-foreground text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                } text-nowrap px-3 pb-2 text-sm`}
              >
                <div className={flowType === type ? "-mb-px" : ""}>
                  {type === "mcp"
                    ? "MCP Server"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              </Button>
            ))}
          </div>
          {/* Search and filters */}
          {flowType === "flows" && (
            <div className="flex justify-between">
              <div className="flex w-full xl:w-5/12">
                <Input
                  icon="Search"
                  data-testid="search-store-input"
                  type="text"
                  placeholder={`Search ${flowType}...`}
                  className="mr-2"
                  value={debouncedSearch}
                  onChange={handleSearch}
                />
                <div className="relative top-[3px] mr-2 flex h-fit rounded-lg border border-muted bg-muted">
                  {/* Sliding Indicator */}
                  <div
                    className={`absolute top-[3px] h-[33px] w-8 transform rounded-lg bg-background shadow-md transition-transform duration-300 ${
                      view === "list"
                        ? "left-[2px] translate-x-0"
                        : "left-[6px] translate-x-full"
                    }`}
                  ></div>
        
                  {/* Buttons */}
                  {["list", "grid"].map((viewType) => (
                    <Button
                      key={viewType}
                      unstyled
                      size="icon"
                      className={`group relative z-10 mx-[2px] my-[3px] flex-1 rounded-lg p-2 ${
                        view === viewType
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      onClick={() => setView(viewType as "list" | "grid")}
                    >
                      <ForwardedIconComponent
                        name={viewType === "list" ? "Menu" : "LayoutGrid"}
                        aria-hidden="true"
                        className="relative bottom-[1px] h-4 w-4 group-hover:text-foreground"
                      />
                    </Button>
                  ))}
                </div>
              </div>
              <ShadTooltip content="New Flow" side="bottom">
                <Button
                  variant="default"
                  className="!px-3 md:!px-4 md:!pl-3.5"
                  onClick={() => setNewProjectModal(true)}
                  id="new-project-btn"
                  data-testid="new-project-btn"
                >
                  <ForwardedIconComponent
                    name="Plus"
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  <span className="hidden whitespace-nowrap font-semibold md:inline">
                    New Flow
                  </span>
                </Button>
              </ShadTooltip>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HeaderComponent;
