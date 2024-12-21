"use client";

import Image from "next/image";
import { useState } from "react";

interface ImgGenProps {
    generateImage: (
        text: string,
    ) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
}

export default function ImgGen({ generateImage }: ImgGenProps) {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setImgUrl(null);
        setError(null);


        try {
            const result = await generateImage(inputText);

            if (!result.success) {
                throw new Error(result.error || "Failed to generate image");
            }

            if (result.imageUrl) {
                setImgUrl(result.imageUrl);
            }
            setInputText("");
        } catch (error) {
            console.error("Error:", error);
            setError(
                error instanceof Error ? error.message : "Failed to generate image"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex flex-col justify-between p-8">
            <main className="flex-1 flex flex-col items-center gap-8">
                <div className="w-full m-5">
                    <h1 className="text-center font-semibold text-4xl">Pentagram Image Generator</h1>
                </div>
                {error && (
                    <div className="w-full max-w-2xl bg-red-500 p-4 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {imgUrl && (
                    <div className="w-full flex items-center max-w-lg mb-8 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={imgUrl}
                            alt={inputText}
                            className="w-full"
                            width={200}
                            height={200}
                        />
                    </div>
                )}

                {isLoading && (
                    <div className="w-full max-w-2xl flex items-center justify-center">
                        <div 
                            className="w-12 h-12 border-4 border-gray-300 dark:border-gray-100 rounded-full animate-spin border-t-blue-500"
                            style={{ animationDuration: "1s" }}
                        />
                    </div>
                )}
            </main>
            <footer className="w-full max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            placeholder="Describe the image you want to generate..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputText.trim()}
                            className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
}