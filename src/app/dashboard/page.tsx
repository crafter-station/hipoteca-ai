"use client";

import { processPDF } from "@/actions/process-pdf";
import { ChatPanel } from "@/components/shared/chat-panel";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadFiles } from "@/lib/uploadthing";
import {
	FileText,
	PanelRightClose,
	PanelRightOpen,
	Sparkles,
	UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";

export default function DashboardPage() {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file && file.type === "application/pdf") {
			setUploadedFile(file);
			const [{ ufsUrl, name }] = await uploadFiles("documentUploader", {
				files: [file],
				onUploadProgress: ({ file, progress }) => {
					console.log("Processing file", "progress", progress);
				},
			});

			await processPDF(ufsUrl, name);

			setPdfUrl(ufsUrl);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type === "application/pdf") {
			setUploadedFile(file);
			const url = URL.createObjectURL(file);
			setPdfUrl(url);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Header */}
			<Header />

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* PDF Viewer Area */}
				<div className="flex flex-1 flex-col">
					{pdfUrl ? (
						<div className="flex h-full flex-col">
							{/* Document header */}
							<div className="flex h-11 items-center justify-between border-border/30 border-b bg-background/80 px-3 py-2 backdrop-blur-lg">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium text-foreground text-sm">
										{uploadedFile?.name || "Document"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="sm"
										className="h-7 w-7 p-0"
										onClick={() => setIsPanelOpen(!isPanelOpen)}
									>
										{isPanelOpen ? (
											<PanelRightClose className="h-4 w-4" />
										) : (
											<PanelRightOpen className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							{/* PDF Display Area */}
							<div className="flex-1 bg-muted/20 p-4">
								<div className="flex h-full items-center justify-center rounded-lg border-2 border-border border-dashed bg-background">
									<div className="text-center">
										<FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
										<p className="text-muted-foreground text-sm">
											PDF Viewer would load here
										</p>
										<p className="text-muted-foreground/70 text-xs">
											File: {uploadedFile?.name}
										</p>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="flex h-full items-center justify-center p-8">
							<Card className="w-full max-w-lg border-2 border-border border-dashed">
								<CardHeader className="text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
										<UploadCloud className="h-8 w-8 text-primary" />
									</div>
									<CardTitle className="text-xl">
										Upload Your Document
									</CardTitle>
									<CardDescription>
										Drag and drop your PDF file here, or click to browse
									</CardDescription>
								</CardHeader>
								<CardContent>
									<button
										type="button"
										className="w-full cursor-pointer rounded-lg border-2 border-border border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
										onDrop={handleDrop}
										onDragOver={handleDragOver}
										onClick={() => fileInputRef.current?.click()}
										aria-label="Upload PDF file"
									>
										<Sparkles className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
										<p className="mb-2 font-medium text-sm">
											Click to upload or drag and drop
										</p>
										<p className="text-muted-foreground text-xs">
											PDF files up to 10MB
										</p>
									</button>
									<Input
										ref={fileInputRef}
										type="file"
										accept=".pdf"
										onChange={handleFileUpload}
										className="hidden"
									/>
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				{/* Chat Panel */}
				{isPanelOpen && (
					<div className="w-80 border-border/30 border-l bg-background">
						<ChatPanel />
					</div>
				)}
			</div>
		</div>
	);
}
