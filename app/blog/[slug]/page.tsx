import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, getAuthor } from "@/lib/blog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const author = getAuthor(post.authorId);
  return {
    title: { absolute: `${post.title} | ${site.name}` },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    authors: [{ name: author.name }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${site.url}/blog/${post.slug}/`,
      images: [{ url: post.image }],
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = getAuthor(post.authorId);
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${site.url}${post.image}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Person",
      name: author.name,
      description: author.bio,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}/`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${site.url}/blog/${post.slug}/`,
      },
    ],
  };

  const Body = post.Body;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog/">Blog</Link>
            <span>/</span>
            {post.title}
          </nav>
          <h1>{post.title}</h1>
          <div className="post-byline">
            <span className="post-byline-author">
              By <strong>{author.name}</strong>, {author.role}
            </span>
            <span className="dot">·</span>
            <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
            <span className="dot">·</span>
            <span>{post.readMinutes} min read</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <article className="post-article">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.imageAlt}
              className="post-featured"
              loading="eager"
            />

            <div className="prose post-body">
              <Body />

              <div className="post-author-card">
                <h2 className="mt-0">About the author</h2>
                <p>
                  <strong>{author.name}</strong> &mdash; {author.role}
                </p>
                <p>{author.bio}</p>
              </div>

              <div className="post-sources">
                <h2>Sources</h2>
                <ul>
                  {post.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <div className="post-related">
            <h2>Keep reading</h2>
            <div className="grid grid-3" style={{ marginTop: "1.4rem" }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}/`} className="listing-card">
                  <span className="listing-card-name">{r.title}</span>
                  <span className="listing-card-meta">{r.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
