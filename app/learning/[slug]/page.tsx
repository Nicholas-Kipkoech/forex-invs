import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content/learning");
  const files = fs.readdirSync(dir);

  return files.map((file) => ({
    slug: file.replace(".md", ""),
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const filepath = path.join(
    process.cwd(),
    "content/learning",
    `${params.slug}.md`
  );

  if (!fs.existsSync(filepath)) {
    return <div className="text-white p-10">Article not found.</div>;
  }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { content, data } = matter(fileContent);

  return (
    <div className="min-h-screen px-6 md:px-12 py-20 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold text-emerald-300">{data.title}</h1>
      {data.description && (
        <p className="text-slate-400 mt-2">{data.description}</p>
      )}

      <div className="mt-10 prose prose-invert max-w-none prose-headings:text-emerald-300 prose-a:text-emerald-400">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
