"use client";

import { Bot, Send, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const COLORS = {
  primary: "#2E4236",
  muted: "#cbd5e1",
  grid: "#e2e8f0",
  text: "#64748b",
  textDark: "#09090b",
  bar: "#4A6B59",
};

const DUMMY_CHART_DATA = [
  { name: "Week 1", value: 65 },
  { name: "Week 2", value: 59 },
  { name: "Week 3", value: 80 },
  { name: "Week 4", value: 81 },
  { name: "Week 5", value: 96 },
];

const DUMMY_TABLE_DATA = [
  { id: 1, entity: "Palm Estate A", efficiency: "98%", status: "Optimal" },
  { id: 2, entity: "Processing Unit B", efficiency: "92%", status: "Good" },
  { id: 3, entity: "Logistics Hub C", efficiency: "88%", status: "Warning" },
  { id: 4, entity: "Refinery D", efficiency: "95%", status: "Optimal" },
];

interface AnswerOption {
  text: string;
  hasChart: boolean;
  hasTable: boolean;
}

const ANSWER_OPTIONS: AnswerOption[] = [
  {
    text: "Based on the real-time analysis of your entity ecosystem, we observed a steady increase in operational efficiency over the last 5 weeks. The system status is largely healthy, though Logistics Hub C requires attention.",
    hasChart: true,
    hasTable: true,
  },
  {
    text: "Your workflow efficiency has improved significantly this quarter. The data shows a consistent upward trend in processing speeds across all units. Here's a visual breakdown of the weekly performance metrics.",
    hasChart: true,
    hasTable: false,
  },
  {
    text: "Here's a summary of your top performing entities based on current operational data. Each entity has been evaluated against key performance indicators including throughput, uptime, and resource utilization.",
    hasChart: false,
    hasTable: true,
  },
  {
    text: "All systems are operating within normal parameters. Current monitoring shows stable performance across your entity ecosystem with no immediate concerns requiring attention. Continue regular maintenance schedules as planned.",
    hasChart: false,
    hasTable: false,
  },
];

const STREAMING_SPEED_MS = 20;
const CHART_DELAY_MS = 300;
const TABLE_DELAY_MS = 300;

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  hasChart?: boolean;
  hasTable?: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface StreamingTextProps {
  text: string;
  onComplete: () => void;
  isActive: boolean;
}

const StreamingText = ({ text, onComplete, isActive }: StreamingTextProps) => {
  const [displayedText, setDisplayedText] = useState(() =>
    isActive ? "" : text,
  );
  const [currentIndex, setCurrentIndex] = useState(() =>
    isActive ? 0 : text.length,
  );

  useEffect(() => {
    if (!isActive || currentIndex >= text.length) {
      if (isActive && currentIndex >= text.length) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, STREAMING_SPEED_MS);

    return () => clearTimeout(timer);
  }, [currentIndex, text, onComplete, isActive]);

  return (
    <span>
      {displayedText}
      {isActive && currentIndex < text.length && (
        <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-current" />
      )}
    </span>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white px-3 py-2 shadow-md outline-none dark:bg-neutral-950">
        <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {label}
        </p>
        <div className="flex flex-col gap-1">
          {payload.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {item.name}:
              </span>
              <span>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hello! I am your AI Assistant. You can ask me about the current condition of your ecosystem, workflow statistics, or entity performance.",
      timestamp: new Date(),
      isStreaming: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [streamingComplete, setStreamingComplete] = useState<
    Record<string, boolean>
  >({});
  const [showChart, setShowChart] = useState<Record<string, boolean>>({});
  const [showTable, setShowTable] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingComplete, showChart, showTable]);

  const handleStreamingComplete = useCallback((messageId: string) => {
    setStreamingComplete((prev) => ({ ...prev, [messageId]: true }));

    setTimeout(() => {
      setShowChart((prev) => ({ ...prev, [messageId]: true }));

      setTimeout(() => {
        setShowTable((prev) => ({ ...prev, [messageId]: true }));
      }, TABLE_DELAY_MS);
    }, CHART_DELAY_MS);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessageId = (Date.now() + 1).toString();
      const randomOption =
        ANSWER_OPTIONS[Math.floor(Math.random() * ANSWER_OPTIONS.length)];
      const aiMessage: Message = {
        id: aiMessageId,
        role: "ai",
        content: randomOption.text,
        hasChart: randomOption.hasChart,
        hasTable: randomOption.hasTable,
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-1 flex-col gap-0 overflow-hidden p-0 shadow-sm">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-10">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  msg.role === "ai"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.role === "ai" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>

              <div
                className={`flex max-w-[80%] flex-col gap-2 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Text Bubble */}
                <div
                  className={`rounded-lg p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "ai" && msg.isStreaming ? (
                    <StreamingText
                      text={msg.content}
                      isActive={!streamingComplete[msg.id]}
                      onComplete={() => handleStreamingComplete(msg.id)}
                    />
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Chart Attachment */}
                {msg.hasChart && (!msg.isStreaming || showChart[msg.id]) && (
                  <Card className="animate-in fade-in slide-in-from-bottom-2 w-full max-w-md overflow-hidden border p-0 duration-300">
                    <CardHeader className="bg-muted/30 p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Efficiency Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={DUMMY_CHART_DATA}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke={COLORS.grid}
                            />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: COLORS.text,
                                fontSize: 12,
                                fontFamily: "var(--font-geist-sans)",
                              }}
                              tickMargin={8}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: COLORS.text,
                                fontSize: 12,
                                fontFamily: "var(--font-geist-sans)",
                              }}
                            />
                            <Tooltip
                              content={<CustomTooltip />}
                              cursor={{ fill: COLORS.muted, opacity: 0.2 }}
                            />
                            <Bar
                              dataKey="value"
                              fill={COLORS.bar}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Table Attachment */}
                {msg.hasTable && (!msg.isStreaming || showTable[msg.id]) && (
                  <Card className="animate-in fade-in slide-in-from-bottom-2 w-full max-w-md gap-0 overflow-hidden border p-0 duration-300">
                    <CardHeader className="bg-primary-light/40 p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Top Performing Entities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Entity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Eff.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {DUMMY_TABLE_DATA.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-medium">
                                {row.entity}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                    row.status === "Optimal"
                                      ? "bg-green-100 text-green-700"
                                      : row.status === "Good"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {row.efficiency}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
                <span className="text-muted-foreground ml-1 text-xs">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex flex-row gap-3">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 animate-pulse items-center justify-center rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center space-x-1 p-2">
                <div className="bg-muted h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                <div className="bg-muted h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                <div className="bg-muted h-2 w-2 animate-bounce rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        <div className="h-10"></div>
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your ecosystem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
