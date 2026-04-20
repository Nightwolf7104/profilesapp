import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      const { data: profiles } = await client.models.UserProfile.list();
      setUserProfiles(profiles || []);
    } catch (err) {
      console.error("Error fetching user profiles:", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
      padding="2rem"
    >
      <Heading level={1}>My Profile</Heading>

      <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "1rem 0" }}>
        Akhil Saraswatula
      </p>

      <Divider />

      {loading && <p style={{ margin: "2rem 0" }}>Loading profile...</p>}

      {error && <p style={{ margin: "2rem 0", color: "red" }}>{error}</p>}

      {!loading && !error && (
        <Grid
          margin="3rem 0"
          autoFlow="row"
          justifyContent="center"
          gap="2rem"
          alignContent="center"
        >
          {userprofiles.length > 0 ? (
            userprofiles.map((userprofile) => (
              <Flex
                key={userprofile.id || userprofile.email}
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap="1rem"
                border="1px solid #ccc"
                padding="2rem"
                borderRadius="12px"
                className="box"
              >
                <View>
                  <Heading level={3}>{userprofile.email}</Heading>
                </View>
              </Flex>
            ))
          ) : (
            <p>No profile records found.</p>
          )}
        </Grid>
      )}

      <p style={{ marginBottom: "1rem" }}>
        Signed in as: {user?.signInDetails?.loginId || user?.username}
      </p>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}