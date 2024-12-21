"use server";

import ImgGen from "./components/ImgGen";
import { generateImage } from "./actions/generateImage";

export default async function Home() {
  return <ImgGen generateImage={generateImage} />
}