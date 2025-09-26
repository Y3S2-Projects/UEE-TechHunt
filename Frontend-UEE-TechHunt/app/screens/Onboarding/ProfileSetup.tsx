import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>
      <Avatar
        size="large"
        rounded
        source={avatar ? { uri: avatar } : undefined}
        icon={{ name: "user", type: "font-awesome" }}
        containerStyle={styles.avatar}
        onPress={pickImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Finish" onPress={() => console.log({ name, avatar })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  avatar: { alignSelf: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 20 },
});
