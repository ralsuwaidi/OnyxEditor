// Declare module for markdown-it-container to avoid using `any`
declare module "markdown-it-container" {
  const markdownItContainer: (md: MarkdownIt, name: string) => void;
  export default markdownItContainer;
}
