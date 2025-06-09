import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View className="flex items-center justify-center gap-3 p-4 bg-[#eae8e6a1] h-fit border border-1 border-[#924711a1] rounded-xl">
        <Text className="text-5xl mt-3 font-agile text-[#341908a1]">
          Sign In
        </Text>
        <View className="flex items-center justify-start ">
          <Image
            source={{
              uri: "https://github.com/burakorkmez/wallet-app-assets/blob/master/revenue-i1.png?raw=true"
            }}
            className="w-[20rem] h-[20rem]"
          />
        </View>

        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          className="w-[20rem] px-5 text-xl bg-white rounded-md focus:border-[#ac7742a1] focus:border-2"
          placeholder="Enter email"
          placeholderTextColor="#baa496a1"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <TextInput
          value={password}
          className="w-[20rem] px-5 text-xl bg-white rounded-md focus:border-[#ac7742a1] focus:border-2"
          placeholder="Enter password"
          placeholderTextColor="#baa496a1"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          onPress={onSignInPress}
          className="px-5 py-2  bg-[#8f4b1ba1] rounded-md mt-4 w-full"
        >
          <Text className="text-2xl w-[10rem] text-center text-white font-agile">
            Continue
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center gap-3">
          <Text className="text-lg font-agile ">Not have an account?</Text>
          <Link href="/sign-up">
            <Text className="text-[#341908a1] font-agile">Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
