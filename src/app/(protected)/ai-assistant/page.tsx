import { PageHeader, UnderDevelopment } from "@/components/layout";

import { AiAssistantChat } from "./components/AiAssistantChat";

const isUnderDevelopment = true;

export default function AiAssistantPage() {
  if (isUnderDevelopment) {
    return <UnderDevelopment />;
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col space-y-4">
      <PageHeader
        title="AI Assistant"
        description="Ask questions about your data and get instant insights"
      />
      <AiAssistantChat />
    </div>
  );
}
