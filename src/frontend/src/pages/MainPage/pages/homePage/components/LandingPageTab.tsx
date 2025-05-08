import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";
import ToolsComponent from "@/components/core/parameterRenderComponent/components/ToolsComponent";
import { Button } from "@/components/ui/button";
import { createApiKey } from "@/controllers/API";
import { api } from "@/controllers/API/api";
import {
  useGetFlowsMCP,
  usePatchFlowsMCP,
} from "@/controllers/API/queries/mcp";
import { PROXY_TARGET } from "@/customization/config-constants";
import useTheme from "@/customization/hooks/use-custom-theme";
import useAuthStore from "@/stores/authStore";
import { useFolderStore } from "@/stores/foldersStore";
import { MCPSettingsType } from "@/types/mcp";
import { parseString } from "@/utils/stringManipulation";
import { cn } from "@/utils/utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";

const LandingPageTab = ({ folderName }: { folderName: string }) => {
  const isDarkMode = useTheme().dark;
  const { folderId } = useParams();
  const myCollectionId = useFolderStore((state) => state.myCollectionId);
  const projectId = folderId ?? myCollectionId ?? "";
  const [isCopied, setIsCopied] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);

  const { data: flowsMCP } = useGetFlowsMCP({ projectId });
  const { mutate: patchFlowsMCP } = usePatchFlowsMCP({ project_id: projectId });

  const isAutoLogin = useAuthStore((state) => state.autoLogin);

  const handleOnNewValue = (value) => {
    const flowsMCPData: MCPSettingsType[] = value.value.map((flow) => ({
      id: flow.id,
      action_name: flow.name,
      action_description: flow.description,
      mcp_enabled: flow.status,
    }));
    patchFlowsMCP(flowsMCPData);
  };

  const flowsMCPData = flowsMCP?.map((flow) => ({
    id: flow.id,
    name: flow.action_name,
    description: flow.action_description,
    display_name: flow.name,
    display_description: flow.description,
    status: flow.mcp_enabled,
    tags: [flow.name],
  }));

  const syntaxHighlighterStyle = {
    "hljs-string": {
      color: isDarkMode ? "hsla(158, 64%, 52%, 1)" : "#059669", // Accent Green
    },
    "hljs-attr": {
      color: isDarkMode ? "hsla(329, 86%, 70%, 1)" : "#DB2777", // Accent Pink
    },
  };

  const apiHost = api.defaults.baseURL || window.location.origin;

  const apiUrl = `${apiHost}/api/v1/mcp/project/${projectId}/sse`;

  const MCP_SERVER_JSON = `{
  "mcpServers": {
    "lf-${parseString(folderName ?? "project", ["snake_case", "no_blank", "lowercase"]).slice(0, 11)}": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--sse",
        "${apiUrl}"${
          isAutoLogin
            ? ""
            : `,
        "--header",
        "x-api-key:${apiKey || "YOUR_API_KEY"}"`
        }
      ]
    }
  }
}`;

  const MCP_SERVER_TUTORIAL_LINK =
    "https://docs.langflow.org/mcp-server#connect-clients-to-use-the-servers-actions";

  const MCP_SERVER_DEPLOY_TUTORIAL_LINK =
    "https://docs.langflow.org/mcp-server#deploy-your-server-externally";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(MCP_SERVER_JSON)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const generateApiKey = () => {
    setIsGeneratingApiKey(true);
    createApiKey(`MCP Server ${folderName}`)
      .then((res) => {
        setApiKey(res["api_key"]);
      })
      .catch((err) => {})
      .finally(() => {
        setIsGeneratingApiKey(false);
      });
  };

  const IFrame = () => (
    <div>
      <iframe scrolling="no" 
        style={{
          width: "100%",
          height: "80vh",
          border: "none",
          borderRadius: "10px",
          marginTop: -42,
          padding: 0,
          overflow: "hidden",
          zIndex: 999999,
        }}
        src="http://localhost:55144/"
        title="GeeksforGeeks"
      />
    </div>
  );

  return (
    <div>
      <IFrame/>
    </div>
  );
};

export default LandingPageTab;
