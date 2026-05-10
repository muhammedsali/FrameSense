import { NextResponse } from "next/server";
import Parser from "rss-parser";

export async function GET() {
  try {
    const parser = new Parser({
      customFields: {
        item: ["content:encoded", "content"],
      },
    });

    const feed = await parser.parseURL(
      "https://medium.com/feed/@balabandoganay"
    );

    const posts = feed.items.slice(0, 6).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      content: item["content:encoded"] || item.content || "",
      contentSnippet: item.contentSnippet || "",
      guid: item.guid || "",
      categories: item.categories || [],
      isoDate: item.isoDate || "",
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching Medium posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}
