import { useQuery } from "convex/react";
import { AudioPlayer, createAudioPlayer } from "expo-audio";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AudioPlayerComponent from "../../components/AudioPlayer";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function RecordingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [player, setPlayer] = useState<AudioPlayer | null>(null);

  // Query the recording directly using the id from params
  const recording = useQuery(
    api.functions.queries.getRecordingById.getRecordingById,
    id ? { recordingId: id as Id<"recordings"> } : "skip"
  );

  useEffect(() => {
    if (recording?.audioUrl) {
      console.log("Effect - Creating player for URL:", recording.audioUrl);
      const newPlayer = createAudioPlayer({ uri: recording.audioUrl });
      setPlayer(newPlayer);
      return () => {
        console.log("Effect - Releasing player for URL:", recording.audioUrl);
        newPlayer.release();
      };
    }
  }, [recording?.audioUrl]);

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No recording ID provided</Text>
      </View>
    );
  }

  if (recording === undefined) {
    return (
      <View style={styles.container}>
        <Text>Loading recording data...</Text>
      </View>
    );
  }

  if (recording === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recording not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recording.name || "Recording"}</Text>
      <Text>URL: {recording.audioUrl}</Text>

      {player && <AudioPlayerComponent player={player} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
