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

interface ExampleFileSystemPageProps
  extends PageProps<Queries.ExampleFileSystemQuery> {}

const ExampleFileSystemPage: React.FC<ExampleFileSystemPageProps> = (props) => {
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Example:
        <br />
        <span style={headingAccentStyles}>gatsby-source-filesystem</span>
      </h1>
      <p style={paragraphStyles}>Rendered content:</p>
      {props.data.file?.markdownToHtml && (
        <>
          <div
            style={paragraphStyles}
            dangerouslySetInnerHTML={{
              __html: props.data.file.markdownToHtml.content,
            }}
          />
          <p style={paragraphStyles}>Extracted data:</p>
          <pre>
            <code>{props.data.file.markdownToHtml.data}</code>
          </pre>
        </>
      )}
    </main>
  );
};

export default ExampleFileSystemPage;

export const Head: HeadFC = () => <title>Example: FileSystem</title>;

export const pageQuery = graphql`
  query ExampleFileSystem {
    file(relativePath: { eq: "test.md" }) {
      markdownToHtml {
        content
        data
      }
    }
  }
`;


