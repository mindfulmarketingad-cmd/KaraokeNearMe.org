import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and stories about karaoke bars, private rooms, and singing out across the United States.",
  alternates: { canonical: "/blog/" },
};

const POSTS = [
  {
    title: "How to Pick the Right Karaoke Night for Your Group",
    excerpt:
      "Open-mic bar karaoke, private KTV rooms, or a restaurant sing-along — here's how to match the format to your crowd.",
  },
  {
    title: "First Time Doing Karaoke? Here's How to Not Be Nervous",
    excerpt:
      "A few practical tips for picking a song, warming up, and having a good time your first time on the mic.",
  },
  {
    title: "What Makes a Great Karaoke Bar",
    excerpt:
      "From song catalogs to sound systems, the details that separate a memorable karaoke night from a forgettable one.",
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Blog
          </nav>
          <h1>Karaoke Near Me Blog</h1>
          <p className="lead">
            Guides and tips for finding a great karaoke night, wherever you are.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {POSTS.map((post) => (
              <div className="feature" key={post.title}>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: "2rem" }}>
            More posts are on the way. In the meantime, browse our{" "}
            <Link href="/states/">state directory</Link> or use the{" "}
            <Link href="/karaoke-finder/">Karaoke Finder</Link> to find a spot
            near you tonight.
          </p>
        </div>
      </section>
    </>
  );
}
