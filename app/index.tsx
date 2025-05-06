import { Button, Text, View } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Index() {
  const tasks = useQuery(api.tasks.get);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {tasks?.map((task) => (
        <Text key={task._id}>{task.text}</Text>
      ))}
      <Button
        title="Add Task"
        onPress={() => {
          console.log("Add Task");
        }}
      />
    </View>
  );
}
