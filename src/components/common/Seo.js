import Head from "next/head";
import { siteMetadata } from "../../../site.config";

export default function SEO({ title, description = "" }) {
  const metaDescription = description || siteMetadata.description;

  return (
    <Head>
      <title>{title + " | " + siteMetadata.title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={title} />
      <meta
        name="og:description"
        property="og:description"
        content={metaDescription}
      />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:creator" content={siteMetadata.social.twitter} />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    </Head>
  );
}
