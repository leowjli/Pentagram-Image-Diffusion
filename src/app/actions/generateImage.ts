"use server";

export async function generateImage(text: string) {
    try {
        const apiUrl = "https://pentagram-image-diffusion.vercel.app/";

        const response = await fetch(`${apiUrl}/api/generate-image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY || "",
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("server error: ", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Failed to generate image",
        };
    }
}