// Declare module for markdown-it-container to avoid using `any`
declare module "markdown-it-hashtag" {
  const markdownItContainer: (md: any) => void;
  export default markdownItContainer;
}
