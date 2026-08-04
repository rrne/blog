import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().filter((p) => !p.draft);

  return [
    { url: site.url, lastModified: new Date(), priority: 1 },
    { url: `${site.url}/posts`, lastModified: new Date(), priority: 0.8 },
    ...posts.map((post) => ({
      url: `${site.url}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.6,
    })),
  ];
}
