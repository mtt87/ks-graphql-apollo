import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Styles from './Styles';
import { apolloClient } from './theme';

const LIST_POSTS = gql`
  query listPosts($groupId: ID!) {
    listPosts(groupId: $groupId) {
      posts {
        ... on PostConversation {
          postId
          content
          timestamp
          commentsTotal
          author {
            id
            name
          }
        }
      }
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($groupId: ID!, $content: String!) {
    addPost(groupId: $groupId, content: $content) {
      postId
      content
      timestamp
      commentsTotal
      author {
        id
        name
      }
    }
  }
`;

class DiscussionList extends Component {
 constructor() {
   super();
   this.state = {
     text: '',
   };
 }

  render() {
    return (
      <div style={{ margin: 40 }}>
        {this.props.showEditor && (
          <Mutation
            mutation={ADD_POST} 
            variables={{
              groupId: "a56d9b6e-a93c-46b1-9a60-9fdcc2abd4c9",
              content: this.state.text,
            }}
            update={(cache, result) => {
              if (this.props.disableUpdate) {
                return;
              }
              const groupId = "a56d9b6e-a93c-46b1-9a60-9fdcc2abd4c9";
              const newPost = result.data.addPost;
              // read existing data in the apollo cache
              const listPostsQuery = apolloClient.readQuery({
                query: LIST_POSTS,
                variables: {
                  groupId
                }
              });
              const { listPosts } = listPostsQuery;
              // add new post at the beginning
              const updatedPostList = [
                newPost,
                ...listPosts.posts
              ];
              // update the apollo cache
              apolloClient.writeQuery({
                query: LIST_POSTS,
                variables: {
                  groupId
                },
                data: {
                  listPosts: {
                    ...listPosts,
                    posts: updatedPostList
                  }
                }
              });
            }}
          >
            {(createPost, { client }) => (
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <textarea
                  style={Styles.textarea}
                  value={this.state.text}
                  onChange={(e) => {
                    const { value } = e.target;
                    this.setState({ text: value });
                  }}
                />
                <button onClick={createPost} style={Styles.btn}>Post</button>
              </div>
            )}
          </Mutation>
        )}
        <h3>Posts</h3>
        <Query query={LIST_POSTS} variables={{ groupId: "a56d9b6e-a93c-46b1-9a60-9fdcc2abd4c9" }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div>...loading</div>
            }
            if (error) {
              return <div>ERROR (check your token in ApolloProvider.js)</div>
            }
            const posts = data.listPosts.posts
              .filter(p => p.content)
              .slice(0, 3);
            return (
              <div>
                {posts.map(post => (
                  <div style={Styles.group} key={post.postId}>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <img style={{ marginRight: 10, height: 50, width: 50, borderRadius: 25}} src={`https://dh2hr12bc8685.cloudfront.net/profile_staging/${post.author.id}/medium.jpg`} />
                        <strong>{post.author.name}</strong>
                      </div>
                      <blockquote>
                        {post.content}
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default DiscussionList;
