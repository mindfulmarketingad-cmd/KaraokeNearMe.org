import type { Metadata } from "next";
import Link from "next/link";
import { posts, getAuthor } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Song guides, tips, and stories for a better karaoke night — the easiest songs to sing, the best rock and country picks, duets, and more.",
  alternates: { canonical: "/blog/" },
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Karaoke Near Me Blog",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${site.url}/blog/${p.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Blog
          </nav>
          <h1>Karaoke Near Me Blog</h1>
          <p className="lead">
            Song guides and practical tips for a better karaoke night, written by
            people who actually go out and sing.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="post-grid">
            {posts.map((post) => {
              const author = getAuthor(post.authorId);
              return (
                <Link key={post.slug} href={`/blog/${post.slug}/`} className="post-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt={post.imageAlt} loading="lazy" />
                  <div className="post-card-body">
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <span className="post-card-meta">
                      {author.name} · {formatDate(post.datePublished)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="muted" style={{ marginTop: "2.4rem" }}>
            Ready to sing? Browse our{" "}
            <Link href="/find/">Find Karaoke by City</Link> maps or use the{" "}
            <Link href="/karaoke-finder/">Karaoke Finder</Link> to find a spot near
            you tonight.
          </p>
        </div>
      </section>
    </>
  );
}
