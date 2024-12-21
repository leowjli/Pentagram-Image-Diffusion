import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const apiSecret = request.headers.get("X-API-Key");
    if (apiSecret !== process.env.API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL("https://leowjli--sd-demo-model-generate.modal.run/")

    url.searchParams.set("prompt", text)

    console.log("Requesting URL ", url.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        Accept: "image/jpeg",
      }
    });

    if(!response.ok) {
      const errText = await response.text();
      console.error("API response: ", errText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errText}`
      );
    }

    // Get the image data as an array buffer
    const imageBuffer = await response.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`;
    // Return the image with the correct content type
    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: 'image/jpeg'
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url
    });

  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { success: false, error: `Failed to process request: ${error}` },
      { status: 500 }
    );
  }
}