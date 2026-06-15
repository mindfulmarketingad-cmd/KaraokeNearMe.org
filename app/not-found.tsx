import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: "96px" }}>
      <div className="container center">
        <span className="eyebrow">Error 404</span>
        <h1>Page not found</h1>
        <p className="lead" style={{ margin: "0 auto 2rem" }}>
          The page you are looking for does not exist or may have moved. Let us
          help you find a place to sing instead.
        </p>
        <div
          className="hero-actions"
          style={{ justifyContent: "center" }}
        >
          <Link href="/" className="btn btn-primary">
            Go to homepage
          </Link>
          <Link href="/states/" className="btn btn-secondary">
            Browse by state
          </Link>
        </div>
      </div>
    </section>
  );
}
