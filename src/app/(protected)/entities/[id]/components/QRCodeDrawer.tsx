"use client";

import { Copy, Download, Printer } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getColorByLabel } from "@/lib/colors";
import type { Entity } from "@/types/entity";

interface QRCodeDrawerProps {
  entity: Entity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDrawer({
  entity,
  open,
  onOpenChange,
}: QRCodeDrawerProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const typeInfo = entity.entity_type;
  const { bg: typeBgColor, fg: typeColor } = getColorByLabel(
    typeInfo?.color ?? "neutral",
  );

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(entity.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    // Create a canvas to draw the complete label
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 40;
    const qrSize = 200;
    const width = 320;
    const height = 360;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.roundRect(10, 10, width - 20, height - 20, 12);
    ctx.stroke();

    // Get QR code as data URL from the hidden canvas
    const qrCanvas = document.querySelector(
      "#qr-canvas-hidden canvas",
    ) as HTMLCanvasElement;
    if (qrCanvas) {
      const qrX = (width - qrSize) / 2;
      ctx.drawImage(qrCanvas, qrX, padding, qrSize, qrSize);
    }

    // Text settings
    const textY = padding + qrSize + 24;

    // Entity name
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(entity.name, width / 2, textY);

    // Entity type
    ctx.fillStyle = "#666666";
    ctx.font = "600 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(
      (entity.entity_type?.name || "Unknown Type").toUpperCase(),
      width / 2,
      textY + 22,
    );

    // Entity code box
    const codeY = textY + 48;
    ctx.font = "bold 14px Monaco, Consolas, monospace";
    const codeWidth = ctx.measureText(entity.code).width + 24;
    const codeX = (width - codeWidth) / 2;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    ctx.roundRect(codeX, codeY - 16, codeWidth, 28, 4);
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.fillText(entity.code, width / 2, codeY + 2);

    // Download
    const link = document.createElement("a");
    link.download = `qr-${entity.code}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${entity.name}</title>
          <style>
            @page {
              margin: 0;
              size: auto;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              width: 100%;
              height: 100%;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #fff;
            }
            .label-container {
              width: 280px;
              padding: 24px;
              border: 2px solid #000;
              border-radius: 12px;
              text-align: center;
              background: white;
            }
            .qr-code {
              margin-bottom: 16px;
            }
            .qr-code svg {
              width: 160px !important;
              height: 160px !important;
              display: block;
              margin: 0 auto;
            }
            .entity-name {
              font-size: 18px;
              font-weight: 800;
              margin-bottom: 6px;
              color: #000;
              line-height: 1.2;
            }
            .entity-type {
              font-size: 11px;
              font-weight: 600;
              color: #444;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 12px;
            }
            .entity-code {
              font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
              font-size: 13px;
              color: #000;
              border: 1.5px solid #000;
              padding: 6px 14px;
              border-radius: 4px;
              display: inline-block;
              font-weight: 700;
            }
            @media print {
              body {
                min-height: 100vh;
              }
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            <div class="qr-code">
              ${printRef.current?.querySelector("svg")?.outerHTML || ""}
            </div>
            <div class="entity-name">${entity.name}</div>
            <div class="entity-type">${entity.entity_type?.name || "Unknown Type"}</div>
            <div class="entity-code">${entity.code}</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[400px] flex-col gap-0 p-0 sm:w-[450px]"
      >
        {/* Header */}
        <SheetHeader className="border-b bg-gray-50/50 px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[0.5px] shadow-sm"
              style={{
                backgroundColor: typeBgColor,
                color: typeColor,
                borderColor: typeColor,
              }}
            >
              <DynamicIcon
                name={(typeInfo?.icon as IconName) || "box"}
                className="h-6 w-6"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <SheetTitle className="truncate text-lg leading-none font-semibold">
                {entity.name}
              </SheetTitle>
              <SheetDescription className="text-xs font-medium">
                {typeInfo?.name || "Entity"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          {/* QR Code Container */}
          <div
            ref={printRef}
            className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm"
          >
            {/* Decorative corner elements */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-gray-200" />
              <div className="absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2 border-gray-200" />
              <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-gray-200" />
              <div className="absolute right-3 bottom-3 h-6 w-6 border-r-2 border-b-2 border-gray-200" />
            </div>

            <QRCodeSVG
              value={entity.code}
              size={180}
              level="H"
              includeMargin={false}
              className="relative z-10"
            />
          </div>

          {/* Hidden canvas for image download */}
          <div id="qr-canvas-hidden" className="hidden">
            <QRCodeCanvas
              ref={canvasRef}
              value={entity.code}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Entity Info */}
          <div className="w-full space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
                Entity Code
              </p>
              <button
                onClick={handleCopyCode}
                className="bg-muted hover:bg-muted/80 group inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-medium transition-colors"
              >
                <span>{entity.code}</span>
                <Copy className="text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-colors" />
              </button>
              {copied && (
                <p className="text-primary mt-2 text-xs font-medium">
                  Copied to clipboard!
                </p>
              )}
            </div>

            <div className="bg-muted/30 rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-wider uppercase">
                Instructions
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Scan this QR code with PalmVue mobile app to quickly identify this
                entity. The code contains the entity&apos;s unique identifier.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 border-t bg-gray-50/50 p-4">
          <Button onClick={handleDownloadImage} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download as Image
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
