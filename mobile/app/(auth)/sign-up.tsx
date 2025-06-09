import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
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
        <View className="flex items-center justify-center w-auto gap-3 p-8 border border-1 border-[#924711a1] bg-[#eae8e6a1] rounded-xl h-fit ">
          <Text className="text-2xl font-agile text-[#341908a1]">
            Verify your email
          </Text>
          <TextInput
            className="w-[20rem] px-5 text-xl bg-white rounded-md focus:border-[#ac7742a1] focus:border-2"
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#baa496a1"
            onChangeText={(code) => setCode(code)}
          />
          <TouchableOpacity
            onPress={onVerifyPress}
            className="px-5 py-1  bg-[#8f4b1ba1] rounded-md mt-4 "
          >
            <Text className="py-2 text-xl text-white font-agile">Verify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }

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
      <View className="flex items-center justify-center w-auto gap-3 p-4 border border-1 border-[#924711a1] bg-[#eae8e6a1] rounded-xl h-fit ">
        <Text className="text-5xl mt-3 font-agile text-[#341908a1]">
          Sign up
        </Text>
        <Image
          source={{
            uri: "https://github.com/burakorkmez/wallet-app-assets/blob/master/revenue-i4.png?raw=true"
          }}
          className="w-[20rem] h-[20rem]"
        />
        <TextInput
          autoCapitalize="none"
          className="w-[20rem] px-5 text-xl bg-white rounded-md focus:border-[#ac7742a1] focus:border-2"
          value={emailAddress}
          placeholderTextColor="#baa496a1"
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
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
          onPress={onSignUpPress}
          className="px-5 py-2  bg-[#8f4b1ba1] rounded-md mt-4 w-full"
        >
          <Text className="text-2xl w-[10rem] text-center text-white font-agile">
            Continue
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center gap-3">
          <Text className="text-lg font-agile ">Already have an account?</Text>
          <Link href="/sign-in">
            <Text className="text-[#341908a1] font-agile">Sign In</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
