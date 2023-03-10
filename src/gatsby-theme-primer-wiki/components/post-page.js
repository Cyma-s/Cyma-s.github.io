import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "gatsby-theme-primer-wiki/src/components/layout";
import ReferencesBlock from "gatsby-theme-primer-wiki/src/components/references-block";
import { MDXProvider } from "@mdx-js/react";
import components from "gatsby-theme-primer-wiki/src/components/mdx-components";
import SEO from "gatsby-theme-primer-wiki/src/components/seo";
import { Box, Heading, Text, useTheme } from "@primer/components";
import { HEADER_HEIGHT } from "gatsby-theme-primer-wiki/src/components/header";
import PageFooter from "gatsby-theme-primer-wiki/src/components/page-footer";
import TableOfContents from "gatsby-theme-primer-wiki/src/components/table-of-contents";
import TagsBlock from "gatsby-theme-primer-wiki/src/components/tags-block";
import { getSidebarItems } from "gatsby-theme-primer-wiki/src/utils/sidebar-items";
import useThemeConfig from "gatsby-theme-primer-wiki/src/use-theme-config";
import PageHistory from "./page-history";
import Blockquote from "gatsby-theme-primer-wiki/src/components/blockquote";
import Giscus from "@giscus/react";

function TagsList({ type = "normal", title, url, items, depth = 0 }) {
  items = items || [];
  return (
    <li>
      <components.a href={url}>
        {type === "tag" ? `#${title}` : title}
      </components.a>
      {Array.isArray(items) && items.length > 0 ? (
        <components.ul>
          {items.map((subItem, index) => (
            <TagsList key={subItem.title} depth={depth + 1} {...subItem} />
          ))}
        </components.ul>
      ) : null}
    </li>
  );
}
const Post = ({ data, pageContext, location }) => {
  const post = data.mdx;
  const tagsOutbound = data.tagsOutbound || {
    nodes: [],
  };

  const primerWikiThemeConfig = useThemeConfig();
  const sidebarItems = getSidebarItems(
    pageContext.sidebarItems,
    pageContext.tagsGroups
  );
  const tagsGroups = pageContext.tagsGroups;
  const {
    tableOfContents,
    frontmatter,
    fields,
    rawBody,
    body,
    inboundReferences,
    outboundReferences,
    excerpt,
  } = post;

  const {
    title,
    gitCreatedAt,
    slug,
    url,
    editUrl,
    shouldShowTitle,
  } = fields;

  const {
    date,
    description,
    imageAlt,
    dateModified,
    tags,
    language,
    seoTitle,
    updated,
  } = frontmatter;
  
  const lastUpdatedTime = updated?.split("+")[0].trim() || "";

  const category = tags && tags[0];
  const datePublished = date
    ? new Date(date.split(" ")[0])
    : gitCreatedAt
    ? new Date(gitCreatedAt)
    : null;

  const postSeoData = {
    title,
    shouldShowTitle,
    description,
    rawBody,
    excerpt,
    datePublished,
    seoTitle,
    dateModified: dateModified
      ? new Date(dateModified)
      : lastUpdatedTime
      ? new Date(lastUpdatedTime.split(" ")[0])
      : datePublished,
    category,
    imageUrl: frontmatter.image ? frontmatter.image.publicURL : null,
    imageAlt: imageAlt,
    url,
    slug,
    tags: tags || [],
    language,
  };
  
  const postSlug = fields.slug;
  const AnchorTag = (props) => (
    <components.a
     {...props} 
     references={outboundReferences} 
     postSlug={postSlug}
     />
  );

  const { resolvedColorMode } = useTheme(); 
  return (
    <Layout pageContext={pageContext} location={location}>
      <SEO post={postSeoData}></SEO>

      <Box
        id="skip-nav"
        display="flex"
        width="100%"
        p={[4, 5, 6, 7]}
        sx={{
          justifyContent: "center",
          flexDirection: "row-reverse",
        }}
      >
        {tableOfContents.items ? (
          <Box
            sx={{ width: 220, flex: "0 0 auto", marginLeft: 6 }}
            display={["none", null, "block"]}
            css={{ gridArea: "table-of-contents", overflow: "auto" }}
            position="sticky"
            top={HEADER_HEIGHT + 24}
            maxHeight={`calc(100vh - ${HEADER_HEIGHT}px - 24px)`}
          >
            <Text display="inline-block" fontWeight="bold" mb={1}>
              On this page
            </Text>
            <TableOfContents items={tableOfContents.items} />
          </Box>
        ) : null}
        <Box width="100%">
          {shouldShowTitle && (
            <Box mb={4}>
              <Box display="flex" sx={{ alignItems: "center" }}>
                <Heading as="h1" mr={2}>
                  {title}
                </Heading>
              </Box>
            </Box>
          )}
	 
	 <PageHistory
            editUrl={editUrl}
            created={date}
            lastUpdated={lastUpdatedTime}
          />
	  
	  {description && <Blockquote>{description}</Blockquote>}

          {tableOfContents.items ? (
            <Box
              borderWidth="1px"
              borderStyle="solid"
              borderColor="border.primary"
              borderRadius={2}
              display={["block", null, "none"]}
              mb={5}
              bg="auto.gray.1"
            >
              <Box p={3}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text fontWeight="bold">On this page</Text>
                </Box>
              </Box>
              <Box
                p={3}
                sx={{
                  borderTop: "1px solid",
                  borderColor: "border.gray",
                }}
              >
                <TableOfContents items={tableOfContents.items} />
              </Box>
            </Box>
          ) : null}
          <MDXProvider components={{ a: AnchorTag }}>
            <MDXRenderer>{body}</MDXRenderer>
          </MDXProvider>

          {slug === "/" &&
            primerWikiThemeConfig.shouldShowTagGroupsOnIndex &&
            sidebarItems.length > 0 && (
              <Box>
                <components.h2>Tags</components.h2>
                {tagsGroups.map((child) => {
                  return (
                    <components.ul key={child.title}>
                      <TagsList
                        title={child.title}
                        url={child.url}
                        type={child.type}
                        items={child.items}
                      ></TagsList>
                    </components.ul>
                  );
                })}
              </Box>
            )}
          <ReferencesBlock references={inboundReferences} />
          {primerWikiThemeConfig.shouldSupportTags && (
            <TagsBlock tags={tags} nodes={tagsOutbound.nodes} />
          )}
	  <Giscus
            repo="Cyma-s/Cyma-s.github.io"
            repoId="R_kgDOI27ORg"
            category="General"
            categoryId="DIC_kwDOI27ORs4CUCCw"
            mapping="specific"
	    term={title}
            reactionsEnabled="1"
            emitMetadata="0"
	    lang="ko"
            theme={resolvedColorMode === "day" ? "light" : "dark"}
          />
        </Box>
      </Box>
    </Layout>
  );
};
export default Post;
