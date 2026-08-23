import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text } from "react-native";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
    >
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <Text className="flex-1 ml-3 text-white">{placeholder}</Text>
    </Pressable>
  );
};

export default SearchBar;
