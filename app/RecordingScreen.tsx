import { useMutation, useQuery } from "convex/react";
import {
  AudioModule,
  AudioPlayer,
  createAudioPlayer,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "../convex/_generated/api";

export default function RecordingScreen() {
  // Convex setup
  const createRecording = useMutation(
    api.functions.mutations.createRecording.createRecording
  );
  const recordings =
    useQuery(api.functions.queries.listRecordings.listRecordings) || [];
  const updateName = useMutation(
    api.functions.mutations.updateRecordingName.updateRecordingName
  );

  // Audio recorder setup
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 500);

  // Active player state
  const [activePlayer, setActivePlayer] = useState<AudioPlayer | null>(null);

  // Ask permission once
  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "Microphone access is needed to record audio"
        );
      }
    })();

    // Cleanup active player on unmount
    return () => {
      activePlayer?.release();
    };
  }, [activePlayer]); // Re-run if activePlayer changes to ensure latest is cleaned

  // Start/stop recording
  const toggleRecording = async () => {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
        const uri = recorder.uri;
        if (!uri) {
          console.warn("No recording URI available");
          return;
        }
        // Instrumentation: duration and file info
        console.log(
          "Recording stopped. Duration (ms):",
          recorderState.durationMillis
        );
        const info = await FileSystem.getInfoAsync(uri);
        console.log("Recorded file info:", info);
        // Debug playback: Release old, create new, play
        activePlayer?.release();
        const debugPlayer = createAudioPlayer({ uri });
        setActivePlayer(debugPlayer);
        debugPlayer.play();
        // Persist recording to backend
        const seconds = recorderState.durationMillis / 1000;
        const defaultName = `Recording ${recordings.length + 1}`;
        await createRecording({
          audioUrl: uri,
          duration: seconds,
          name: defaultName,
        });
      } else {
        await recorder.prepareToRecordAsync();
        recorder.record();
      }
    } catch (e) {
      console.error("Recording error", e);
    }
  };

  // Play audio via expo-audio
  const playAudio = (uri: string) => {
    try {
      activePlayer?.release(); // Release any existing player
      const newPlayer = createAudioPlayer({ uri });
      setActivePlayer(newPlayer); // Store the new player
      newPlayer.play();
    } catch (e) {
      console.error("Playback error", e);
    }
  };

  // Rename prompt
  const promptRename = (rec: { _id: any; name?: string; audioUrl: string }) => {
    Alert.prompt(
      "Rename Recording",
      "Enter a new name",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async (newName) => {
            if (newName) {
              await updateName({ recordingId: rec._id, name: newName });
            }
          },
        },
      ],
      "plain-text",
      rec.name || ""
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        title={recorderState.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={toggleRecording}
      />

      <Text style={styles.sectionTitle}>Saved Recordings</Text>
      {recordings.map((rec) => (
        <View key={rec._id} style={styles.recordingItem}>
          <Text style={styles.recordingText} numberOfLines={1}>
            {rec.name || rec.audioUrl}
          </Text>
          <Button title="Play" onPress={() => playAudio(rec.audioUrl)} />
          <Button title="Rename" onPress={() => promptRename(rec)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  recordingText: {
    flex: 1,
    marginRight: 10,
  },
});
