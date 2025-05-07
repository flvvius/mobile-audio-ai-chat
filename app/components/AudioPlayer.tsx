import { AudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface AudioPlayerProps {
  player: AudioPlayer;
}

export default function AudioPlayerComponent({ player }: AudioPlayerProps) {
  const playerStatus = useAudioPlayerStatus(player);
  const [currentPlaybackSpeed, setCurrentPlaybackSpeed] = useState(1.0);

  const togglePlayPause = async () => {
    if (!playerStatus) return;
    console.log(
      "togglePlayPause. Current status playing:",
      playerStatus.playing
    );
    if (playerStatus.playing) {
      await player.pause();
    } else {
      await player.play();
    }
  };

  const handleSeek = async (value: number) => {
    if (
      !playerStatus ||
      playerStatus.duration === null ||
      playerStatus.duration === undefined
    )
      return;
    const seekPosition = value * playerStatus.duration * 1000;
    console.log("handleSeek to position (ms):", seekPosition);
    await player.seekTo(seekPosition);
  };

  const changePlaybackSpeed = async (speed: number) => {
    console.log("changePlaybackSpeed to:", speed);
    await player.setPlaybackRate(speed);
    setCurrentPlaybackSpeed(speed);
  };

  return (
    <View style={styles.container}>
      <Text>
        Duration:{" "}
        {(playerStatus.duration !== null && playerStatus.duration !== undefined
          ? playerStatus.duration
          : 0
        ).toFixed(1)}
        s
      </Text>
      <Text>Current Time: {(playerStatus.currentTime || 0).toFixed(1)}s</Text>

      <View style={styles.controlsContainer}>
        <Button
          title={playerStatus.playing ? "Pause" : "Play"}
          onPress={togglePlayPause}
        />
      </View>

      <Text style={styles.speedControlTitle}>Playback Speed:</Text>
      <View style={styles.speedButtonsContainer}>
        {[0.5, 1.0, 1.5, 2.0].map((speed) => (
          <Button
            key={speed}
            title={`${speed}x`}
            onPress={() => changePlaybackSpeed(speed)}
            color={currentPlaybackSpeed === speed ? "#007AFF" : "#AAA"}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  controlsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  speedControlTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  speedButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
