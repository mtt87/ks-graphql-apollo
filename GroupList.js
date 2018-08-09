import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Styles from './Styles';

const LIST_GROUPS = gql`
  query {
    listGroups{
      groupId
      name
      description
      admin
      avatar
      banner
      isMember
    }
  }
`;

const JOIN_GROUP = gql`
 mutation joinGroup($groupId: ID!) {
   joinGroup(groupId: $groupId) {
     groupId
     isMember
   }
 }
`;

const LEAVE_GROUP = gql`
 mutation leaveGroup($groupId: ID!) {
   leaveGroup(groupId: $groupId) {
     groupId
     isMember
   }
 }
`;


const GroupList = (props) => (
  <Query query={LIST_GROUPS}>
    {({ loading, error, data }) => {
      if (loading) {
        return <div>...loading</div>
      }
      if (error) {
        return <div>ERROR (check your token in ApolloProvider.js)</div>
      }
      // data available
      const groups = data.listGroups;
      const myGroups = groups.filter(g => g.isMember);
      const otherGroups = groups.filter(g => !g.isMember);
      return (
        <div style={{ margin: '0 40px'}}>
          <h2>My Groups</h2>
          {myGroups.map(({ groupId, name }) => (
            <div style={Styles.group} key={groupId}>
              {name}
              <Mutation
                mutation={LEAVE_GROUP}
                variables={{ groupId }}
              >
                {(leaveGroup) => (
                  <button
                    onClick={leaveGroup}
                    style={Styles.btn}
                  >
                    LEAVE GROUP
                  </button>
                )}
              </Mutation>
            </div>
          ))}
          <h2>Available Groups</h2>
          {otherGroups.map(({ groupId, name }) => (
            <div style={Styles.group} key={groupId}>
              {name}
              <Mutation
                mutation={JOIN_GROUP}
                variables={{ groupId }}
              >
                {(joinGroup) => (
                  <button
                    onClick={joinGroup}
                    style={Styles.btn}
                  >
                    JOIN GROUP
                  </button>
                )}
              </Mutation>
            </div>
          ))}
        </div>
      )
    }}
  </Query>
);

export default GroupList;
