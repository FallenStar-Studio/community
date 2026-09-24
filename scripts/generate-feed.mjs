// Run inside the repository that owns the public GitHub Discussions.
import { writeFile } from 'node:fs/promises';

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository || repository.split('/').length !== 2) {
  throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required');
}

const [owner, repo] = repository.split('/');
const query = `query($owner:String!,$repo:String!){
  repository(owner:$owner,name:$repo){
    discussionCategories(first:25){nodes{id name slug description emoji isAnswerable}}
    discussions(first:50,orderBy:{field:UPDATED_AT,direction:DESC}){
      totalCount pageInfo{hasNextPage endCursor}
      nodes{
        id databaseId number title bodyText createdAt updatedAt url
        category{id name slug} author{login}
        comments(first:15){
          totalCount pageInfo{hasNextPage endCursor}
          nodes{
            id bodyText createdAt author{login}
            replies(first:10){pageInfo{hasNextPage endCursor} nodes{id bodyText createdAt author{login}}}
          }
        }
      }
    }
  }
}`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'PlyraCommunityFeed/0.1'
  },
  body: JSON.stringify({ query, variables: { owner, repo } })
});
if (!response.ok) throw new Error(`GitHub GraphQL returned HTTP ${response.status}`);

const result = await response.json();
if (result.errors?.length) throw new Error(result.errors.map((error) => error.message).join('; '));
const repositoryData = result.data?.repository;
const discussions = repositoryData?.discussions?.nodes;
const categories = repositoryData?.discussionCategories?.nodes;
if (!Array.isArray(discussions) || !Array.isArray(categories)) {
  throw new Error('Discussions or categories are not available in this repository');
}

const posts = discussions.filter(Boolean).map((post) => ({
  id: post.id,
  databaseId: post.databaseId,
  number: post.number,
  title: post.title,
  bodyText: post.bodyText,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  url: post.url,
  category: post.category,
  author: { login: post.author?.login ?? 'unknown' },
  commentCount: post.comments?.totalCount ?? 0,
  comments: {
    totalCount: post.comments?.totalCount ?? 0,
    pageInfo: post.comments?.pageInfo ?? { hasNextPage: false, endCursor: null },
    nodes: (post.comments?.nodes ?? []).map((comment) => ({
      id: comment.id,
      bodyText: comment.bodyText,
      createdAt: comment.createdAt,
      author: { login: comment.author?.login ?? 'unknown' },
      replies: {
        nodes: comment.replies?.nodes ?? [],
        pageInfo: comment.replies?.pageInfo ?? { hasNextPage: false, endCursor: null }
      }
    }))
  }
}));

const feed = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  categories: categories.filter(Boolean),
  posts,
  discussionPageInfo: repositoryData.discussions.pageInfo ?? { hasNextPage: false, endCursor: null }
};
await writeFile('docs/feed.json', `${JSON.stringify(feed, null, 2)}\n`);
console.log(`Generated ${feed.categories.length} categories and ${posts.length} Discussions.`);
