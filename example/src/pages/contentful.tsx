import * as React from "react";
import { graphql, type HeadFC, type PageProps } from "gatsby";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
};
const headingAccentStyles = {
  color: "#663399",
};
const paragraphStyles = {
  marginBottom: 48,
};

interface ExampleContentfulPageProps
  extends PageProps<Queries.ExampleContentfulQuery> {}

const ExampleContentfulPage: React.FC<ExampleContentfulPageProps> = (props) => {
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Example:
        <br />
        <span style={headingAccentStyles}>gatsby-source-filesystem</span>
      </h1>
      <p style={paragraphStyles}>Rendered content:</p>
      {props.data.contentfulText?.longMarkdown?.markdownToHtml && (
        <>
          <div
            style={paragraphStyles}
            dangerouslySetInnerHTML={{
              __html:
                props.data.contentfulText?.longMarkdown?.markdownToHtml?.content || "",
            }}
          />
          <p style={paragraphStyles}>Extracted data:</p>
          <pre>
            <code>
              {JSON.stringify(
                props.data.contentfulText.longMarkdown.markdownToHtml.data
              )}
            </code>
          </pre>
        </>
      )}
    </main>
  );
};

export default ExampleContentfulPage;

export const Head: HeadFC = () => <title>Example: Contentful</title>;

export const pageQuery = graphql`
  query ExampleContentful {
    contentfulText(contentful_id: { eq: "3pwKS9UWsYmOguo4UdE1EB" }) {
      longMarkdown {
        markdownToHtml {
          content
          data
        }
      }
    }
  }
`;
